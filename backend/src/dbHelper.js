const { db, isFirestoreAvailable, readLocalCollection, writeLocalCollection } = require("./firestore");
const crypto = require("crypto");

function generateId() {
  return crypto.randomBytes(12).toString("hex");
}

async function getCollection(collectionName) {
  if (isFirestoreAvailable && db) {
    try {
      const snap = await db.collection(collectionName).get();
      return snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    } catch (err) {
      console.warn(`[dbHelper] Firestore read failed, using local store for ${collectionName}:`, err.message);
    }
  }
  return readLocalCollection(collectionName);
}

async function findById(collectionName, id) {
  if (isFirestoreAvailable && db) {
    try {
      const doc = await db.collection(collectionName).doc(id).get();
      if (doc.exists) {
        return { _id: doc.id, ...doc.data() };
      }
    } catch (err) {
      console.warn(`[dbHelper] Firestore findById failed for ${collectionName}:`, err.message);
    }
  }
  const all = readLocalCollection(collectionName);
  return all.find((item) => item._id === id || item.id === id) || null;
}

async function findOne(collectionName, query) {
  if (isFirestoreAvailable && db) {
    try {
      let ref = db.collection(collectionName);
      for (const [k, v] of Object.entries(query)) {
        ref = ref.where(k, "==", v);
      }
      const snap = await ref.limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { _id: doc.id, ...doc.data() };
      }
    } catch (err) {
      console.warn(`[dbHelper] Firestore findOne query failed:`, err.message);
    }
  }
  const all = readLocalCollection(collectionName);
  return (
    all.find((item) =>
      Object.entries(query).every(([k, v]) => item[k] === v)
    ) || null
  );
}

async function insertOne(collectionName, data) {
  const _id = data._id || generateId();
  const record = { ...data, _id, createdAt: new Date().toISOString() };

  // Always mirror in local store as cache
  const localList = readLocalCollection(collectionName);
  localList.push(record);
  writeLocalCollection(collectionName, localList);

  if (isFirestoreAvailable && db) {
    try {
      await db.collection(collectionName).doc(_id).set(record);
    } catch (err) {
      console.warn(`[dbHelper] Firestore insert failed for ${collectionName}:`, err.message);
    }
  }

  return record;
}

async function updateOne(collectionName, id, updates) {
  // Mirror locally
  const localList = readLocalCollection(collectionName);
  const idx = localList.findIndex((item) => item._id === id || item.id === id);
  let updated = null;
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...updates, updatedAt: new Date().toISOString() };
    updated = localList[idx];
    writeLocalCollection(collectionName, localList);
  }

  if (isFirestoreAvailable && db) {
    try {
      await db.collection(collectionName).doc(id).set(updates, { merge: true });
      const snap = await db.collection(collectionName).doc(id).get();
      if (snap.exists) updated = { _id: snap.id, ...snap.data() };
    } catch (err) {
      console.warn(`[dbHelper] Firestore update failed for ${collectionName}:`, err.message);
    }
  }

  return updated;
}

async function deleteOne(collectionName, id) {
  const localList = readLocalCollection(collectionName).filter(
    (item) => item._id !== id && item.id !== id
  );
  writeLocalCollection(collectionName, localList);

  if (isFirestoreAvailable && db) {
    try {
      await db.collection(collectionName).doc(id).delete();
    } catch (err) {
      console.warn(`[dbHelper] Firestore delete failed:`, err.message);
    }
  }
  return true;
}

module.exports = {
  getCollection,
  findById,
  findOne,
  insertOne,
  updateOne,
  deleteOne,
};
