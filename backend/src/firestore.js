const { Firestore } = require("@google-cloud/firestore");
const fs = require("fs");
const path = require("path");

const projectId = process.env.GCP_PROJECT_ID || "spirits-campus-events";
const databaseId = process.env.GCP_DATABASE_ID || "(default)";

let db = null;
let isFirestoreAvailable = false;

// If running in Google Cloud (Cloud Run / GCE) or explicit credentials file provided
const hasKeyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const isGcpEnvironment = Boolean(process.env.K_SERVICE || process.env.GAE_INSTANCE || hasKeyFile);

if (isGcpEnvironment) {
  try {
    const options = { projectId, databaseId };
    if (hasKeyFile) {
      options.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
    db = new Firestore(options);
    isFirestoreAvailable = true;
    console.log(`[Firestore] Initialized client for project "${projectId}" (database: "${databaseId}")`);
  } catch (err) {
    console.warn(`[Firestore] Could not initialize Firestore directly:`, err.message);
    isFirestoreAvailable = false;
  }
} else {
  console.log(`[Firestore] Local environment active without Service Account Key; using local persistent store for lightning-fast responses.`);
}

// Local persistent store
const localDataDir = path.join(__dirname, "../data");
if (!fs.existsSync(localDataDir)) fs.mkdirSync(localDataDir, { recursive: true });

function getLocalFile(collectionName) {
  return path.join(localDataDir, `${collectionName}.json`);
}

function readLocalCollection(collectionName) {
  const f = getLocalFile(collectionName);
  if (!fs.existsSync(f)) return [];
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return [];
  }
}

function writeLocalCollection(collectionName, data) {
  const f = getLocalFile(collectionName);
  fs.writeFileSync(f, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  db,
  isFirestoreAvailable,
  projectId,
  readLocalCollection,
  writeLocalCollection,
};
