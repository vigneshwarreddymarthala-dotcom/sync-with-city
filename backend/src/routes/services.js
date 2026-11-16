const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const { getCollection, findById, insertOne, updateOne, deleteOne } = require("../dbHelper");

const JWT_SECRET = process.env.JWT_SECRET || "sync_with_city_secret_key_2026";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

function getAuthUser(req) {
  const token = req.headers.authorization || req.headers["x-access-token"];
  if (!token) return null;
  try {
    return jwt.verify(token.replace(/^Bearer\s+/i, ""), JWT_SECRET);
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// POSTS & EVENTS
// -------------------------------------------------------------
router.get("/post/location/:location/:skip/:limit", async (req, res) => {
  try {
    const posts = await getCollection("posts");
    const { location, skip = 0, limit = 12 } = req.params;
    const filtered = (location && location.toLowerCase() !== "all")
      ? posts.filter(p => p.location && p.location.toLowerCase() === location.toLowerCase())
      : posts;
    const toReturn = filtered.length > 0 ? filtered : posts;
    const list = toReturn.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: toReturn.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/post/restaurant/:id", async (req, res) => {
  try {
    let post = await findById("posts", req.params.id);
    if (!post) post = await findById("events", req.params.id);
    if (!post) {
      const posts = await getCollection("posts");
      post = posts.find(p => p._id === req.params.id || p.id === req.params.id);
    }
    return res.status(200).json(post || { _id: req.params.id, title: "Post Details" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let post = await findById("posts", req.params.id);
    if (!post) post = await findById("events", req.params.id);
    if (!post) {
      const posts = await getCollection("posts");
      post = posts.find(p => p._id === req.params.id || p.id === req.params.id);
    }
    if (!post) {
      const events = await getCollection("events");
      post = events.find(e => e._id === req.params.id || e.id === req.params.id);
    }
    return res.status(200).json(post || { _id: req.params.id, title: "Post Details" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/post/edit/:id", async (req, res) => {
  try {
    const updated = await updateOne("posts", req.params.id, req.body);
    await updateOne("events", req.params.id, req.body);
    return res.status(202).json({ message: "Post updated successfully", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/post/admin/:skip/:limit", async (req, res) => {
  try {
    const posts = await getCollection("posts");
    const { skip = 0, limit = 18 } = req.params;
    const list = posts.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: posts.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/post/admin/:id", async (req, res) => {
  try {
    const updated = await updateOne("posts", req.params.id, req.body);
    return res.status(200).json({ message: "Post updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/post/admin/:id", async (req, res) => {
  try {
    await deleteOne("posts", req.params.id);
    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/post/:id", async (req, res) => {
  try {
    await deleteOne("posts", req.params.id);
    await deleteOne("events", req.params.id);
    return res.status(200).json("Post Deleted Successfully!");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/post/:skip/:limit", async (req, res) => {
  try {
    const posts = await getCollection("posts");
    const { skip = 0, limit = 12 } = req.params;
    const list = posts.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: posts.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/post/:rId/:skip/:limit", async (req, res) => {
  try {
    const posts = await getCollection("posts");
    const { skip = 0, limit = 12 } = req.params;
    const list = posts.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: posts.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/post", async (req, res) => {
  try {
    const auth = getAuthUser(req);
    const rId = req.body.rId || auth?.rId || auth?.id || "hub-1";
    const usrId = req.body.usrId || auth?.id || "student-1";
    const newPost = {
      ...req.body,
      rId,
      usrId,
      bookedSeats: req.body.bookedSeats || "0",
      seats: req.body.seats || "10",
      createdAt: new Date().toISOString()
    };
    const post = await insertOne("posts", newPost);
    await insertOne("events", { ...newPost, _id: post._id });
    return res.status(202).json({ message: "Post Created Successfully!", data: post });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/post/upload", upload.single("postImg"), (req, res) => {
  if (!req.file) return res.status(200).json("default-post.jpg");
  return res.status(200).json(req.file.filename);
});

// Events generic
router.get("/event", async (req, res) => {
  try {
    const events = await getCollection("events");
    return res.status(200).json({ data: events });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/event", async (req, res) => {
  try {
    const event = await insertOne("events", req.body);
    return res.status(202).json({ message: "Event created", data: event });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/event/:id", async (req, res) => {
  try {
    const event = await findById("events", req.params.id);
    return res.status(200).json(event || { _id: req.params.id, title: "Campus Event" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Offers
router.get("/offer/location/:location/:skip/:limit", async (req, res) => {
  try {
    const offers = await getCollection("offers");
    const { location, skip = 0, limit = 12 } = req.params;
    const filtered = (location && location.toLowerCase() !== "all")
      ? offers.filter(o => o.location && o.location.toLowerCase() === location.toLowerCase())
      : offers;
    const list = filtered.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: filtered.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/offer/:rId/:skip/:limit", async (req, res) => {
  try {
    const offers = await getCollection("offers");
    return res.status(200).json({ data: offers });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// BOOKINGS & SEAT RESERVATION
// -------------------------------------------------------------
router.post("/booking", async (req, res) => {
  try {
    const auth = getAuthUser(req);
    const usrId = auth?.id || req.body.usrId || "guest-user";
    const noSpot = parseInt(req.body.noSpot || 1);

    const bk = await insertOne("bookings", {
      ...req.body,
      usrId,
      noSpot: noSpot.toString(),
      status: req.body.status || "Confirmed",
      payStatus: "Paid",
      createdAt: new Date().toISOString(),
    });

    if (req.body.eventId) {
      const post = await findById("posts", req.body.eventId);
      if (post) {
        const currentBooked = parseInt(post.bookedSeats || 0);
        const newBooked = (currentBooked + noSpot).toString();
        await updateOne("posts", req.body.eventId, { bookedSeats: newBooked });
        await updateOne("events", req.body.eventId, { bookedSeats: newBooked });
      }
    }

    if (req.body.rName || req.body.yrName) {
      await insertOne("conversations", {
        cId: bk._id,
        rId: req.body.rId || "organizer",
        rName: req.body.rName || "Event Host",
        usrId,
        usrName: req.body.yrName || "Attendee",
        lastMsg: `Joined ${req.body.eventName || "Event"} (${noSpot} seat${noSpot > 1 ? "s" : ""})`,
        updatedAt: new Date().toISOString()
      });
    }

    return res.status(202).json({ message: "Booking Confirmed! You are registered.", data: bk });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking/user/0/10", async (req, res) => {
  try {
    const bookings = await getCollection("bookings");
    return res.status(200).json({ data: bookings, total: bookings.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking/user/:skip/:limit", async (req, res) => {
  try {
    const bookings = await getCollection("bookings");
    const { skip = 0, limit = 10 } = req.params;
    const data = bookings.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data, total: bookings.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking/owner/:rId", async (req, res) => {
  try {
    const bookings = await getCollection("bookings");
    return res.status(200).json({ data: bookings, total: bookings.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking/event/:id", async (req, res) => {
  try {
    const bookings = await getCollection("bookings");
    const filtered = bookings.filter(b => b.eventId === req.params.id);
    return res.status(200).json({ data: filtered });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking/:id/0/10", async (req, res) => {
  try {
    const bookings = await getCollection("bookings");
    const filtered = bookings.filter(b => b.eventId === req.params.id);
    return res.status(200).json({ data: filtered });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking/:skip/:limit", async (req, res) => {
  try {
    const bookings = await getCollection("bookings");
    const { skip = 0, limit = 18 } = req.params;
    const data = bookings.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data, total: bookings.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/booking/status/:id", async (req, res) => {
  try {
    const updated = await updateOne("bookings", req.params.id, { status: req.body.status });
    return res.status(202).json({ message: "Booking status updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/booking/admin/:id", async (req, res) => {
  try {
    await deleteOne("bookings", req.params.id);
    return res.status(200).json({ message: "Booking deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// STORE, CART & ORDERS
// -------------------------------------------------------------
router.get("/store/:loc/:cate/:skip/:limit", async (req, res) => {
  try {
    const creators = await getCollection("creators");
    const { loc, cate, skip = 0, limit = 18 } = req.params;
    let filtered = creators;
    if (loc && loc.toLowerCase() !== "all") {
      filtered = filtered.filter(c => !c.location || c.location.toLowerCase() === loc.toLowerCase());
    }
    if (cate && cate.toLowerCase() !== "all") {
      filtered = filtered.filter(c => !c.category || c.category.toLowerCase().includes(cate.toLowerCase()));
    }
    const toReturn = filtered.length > 0 ? filtered : creators;
    const data = toReturn.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data, total: toReturn.length });
  } catch (err) {
    return res.status(500).json({ error: err.message, data: [], total: 0 });
  }
});

router.get("/store/:rId/:skip/:limit", async (req, res) => {
  try {
    const storeItems = await getCollection("store");
    const { skip = 0, limit = 50 } = req.params;
    const data = storeItems.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data, total: storeItems.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/store/view/:id", async (req, res) => {
  try {
    const item = await findById("store", req.params.id);
    return res.status(200).json(item || { _id: req.params.id, proName: "Campus Product", price: "19.99" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/store/:id", async (req, res) => {
  try {
    const item = await findById("store", req.params.id);
    return res.status(200).json(item || { _id: req.params.id, proName: "Campus Product" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/store", async (req, res) => {
  try {
    const item = await insertOne("store", { ...req.body, createdAt: new Date().toISOString() });
    return res.status(202).json({ message: "Store item created", data: item });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/store/edit/:id", async (req, res) => {
  try {
    const updated = await updateOne("store", req.params.id, req.body);
    return res.status(202).json({ message: "Product updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/store/upload", upload.single("proImg"), (req, res) => {
  if (!req.file) return res.status(200).json("default-pro.jpg");
  return res.status(200).json(req.file.filename);
});

router.post("/cart/add", async (req, res) => {
  try {
    const item = await insertOne("cart", req.body);
    return res.status(200).json({ message: "Added to cart", data: item });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/my-cart", async (req, res) => {
  try {
    const cart = await getCollection("cart");
    return res.status(200).json({ data: cart });
  } catch (err) {
    return res.status(500).json({ error: err.message, data: [] });
  }
});

router.get("/cart", async (req, res) => {
  try {
    const cart = await getCollection("cart");
    return res.status(200).json({ data: cart });
  } catch (err) {
    return res.status(500).json({ error: err.message, data: [] });
  }
});

router.get("/cart/:id", async (req, res) => {
  try {
    const cart = await getCollection("cart");
    return res.status(200).json({ data: cart });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/cart/:id", async (req, res) => {
  try {
    await deleteOne("cart", req.params.id);
    return res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/order/0/10", async (req, res) => {
  try {
    const orders = await getCollection("orders");
    return res.status(200).json({ data: orders, total: orders.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/order/:skip/:limit", async (req, res) => {
  try {
    const orders = await getCollection("orders");
    return res.status(200).json({ data: orders, total: orders.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/order", async (req, res) => {
  try {
    const order = await insertOne("orders", { ...req.body, status: "Confirmed", createdAt: new Date().toISOString() });
    return res.status(202).json({ message: "Order placed successfully", data: order });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/order/owner/:rId", async (req, res) => {
  try {
    const orders = await getCollection("orders");
    return res.status(200).json({ data: orders });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/order/status/:id", async (req, res) => {
  try {
    const updated = await updateOne("orders", req.params.id, { status: req.body.status });
    return res.status(202).json({ message: "Order updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// NEWS
// -------------------------------------------------------------
router.get("/news", async (req, res) => {
  try {
    const news = await getCollection("news");
    return res.status(200).json({ data: news });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/news/user/0/120", async (req, res) => {
  try {
    const news = await getCollection("news");
    return res.status(200).json({ data: news, total: news.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/news/:skip/:limit", async (req, res) => {
  try {
    const { skip = 0, limit = 12 } = req.params;
    const news = await getCollection("news");
    const list = news.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: news.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/news/:id", async (req, res) => {
  try {
    await deleteOne("news", req.params.id);
    return res.status(200).json("News Deleted Successfully!");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/news/:cate/:loc/0/120", async (req, res) => {
  try {
    const news = await getCollection("news");
    return res.status(200).json({ data: news, total: news.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/news/:id", async (req, res) => {
  try {
    const item = await findById("news", req.params.id);
    return res.status(200).json(item || { _id: req.params.id, newsTitle: "Campus News" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/news", async (req, res) => {
  try {
    const n = await insertOne("news", req.body);
    return res.status(202).json({ message: "News created", data: n });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/news/edit/:id", async (req, res) => {
  try {
    const updated = await updateOne("news", req.params.id, req.body);
    return res.status(200).json({ message: "News updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/news/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  return res.status(200).json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

// -------------------------------------------------------------
// REVIEWS
// -------------------------------------------------------------
router.post("/review", async (req, res) => {
  try {
    const r = await insertOne("reviews", req.body);
    return res.status(202).json({ message: "Review submitted successfully", data: r });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/review/:id/0/10", async (req, res) => {
  try {
    const reviews = await getCollection("reviews");
    const filtered = reviews.filter(r => r.eventId === req.params.id || r.rId === req.params.id);
    return res.status(200).json({ data: filtered });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// MESSAGES & CONVERSATIONS
// -------------------------------------------------------------
router.get("/conversation/user", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const convos = await getCollection("conversations");
    const userId = authUser ? (authUser._id || authUser.id) : null;
    const filtered = userId
      ? convos.filter(c => c.rId === userId || c.usrId === userId)
      : convos;
    return res.status(200).json(filtered);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/conversation/user/:id", async (req, res) => {
  try {
    let convo = await findById("conversations", req.params.id);
    if (!convo) {
      const convos = await getCollection("conversations");
      convo = convos.find(c => c._id === req.params.id || c.id === req.params.id);
    }
    if (!convo) {
      return res.status(404).json("Conversation not found");
    }
    return res.status(200).json(convo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/conversation/restaurant/:id", async (req, res) => {
  try {
    let convo = await findById("conversations", req.params.id);
    if (!convo) {
      const convos = await getCollection("conversations");
      convo = convos.find(c => c._id === req.params.id || c.id === req.params.id);
    }
    return res.status(200).json(convo || { _id: req.params.id, rName: "Host" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/conversation/restaurant", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const convos = await getCollection("conversations");
    const userId = authUser ? (authUser._id || authUser.id) : null;
    const filtered = userId
      ? convos.filter(c => c.rId === userId || c.usrId === userId)
      : convos;
    return res.status(200).json(filtered);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/conversation/restaurant", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const userId = authUser ? (authUser._id || authUser.id) : null;
    const { usrId, rName, usrName } = req.body;
    const rId = req.body.rId || userId || "user";

    const convos = await getCollection("conversations");
    let existing = convos.find(
      c => (c.rId === rId && c.usrId === usrId) || (c.rId === usrId && c.usrId === rId)
    );

    if (existing) {
      return res.status(202).json(existing._id);
    }

    const convo = await insertOne("conversations", {
      rId,
      rName: rName || "Student",
      usrId,
      usrName: usrName || "Friend",
      createdAt: new Date().toISOString()
    });
    return res.status(202).json(convo._id);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/message/user/:id", async (req, res) => {
  try {
    const msgs = await getCollection("messages");
    const filtered = msgs.filter(m => m.cId === req.params.id);
    filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    return res.status(200).json({ data: filtered });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/message/restaurant/:id", async (req, res) => {
  try {
    const msgs = await getCollection("messages");
    const filtered = msgs.filter(m => m.cId === req.params.id);
    filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    return res.status(200).json({ data: filtered });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/message/user", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const senderId = req.body.senderId || (authUser ? (authUser._id || authUser.id) : null);
    const msg = await insertOne("messages", {
      ...req.body,
      senderId,
      createdAt: new Date().toISOString()
    });
    if (req.body.cId) {
      await updateOne("conversations", req.body.cId, {
        lastMsg: new Date().toISOString()
      });
    }
    return res.status(202).json("Message Sent Successfully!");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/message/restaurant", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const senderId = req.body.senderId || (authUser ? (authUser._id || authUser.id) : null);
    const msg = await insertOne("messages", {
      ...req.body,
      senderId,
      createdAt: new Date().toISOString()
    });
    if (req.body.cId) {
      await updateOne("conversations", req.body.cId, {
        lastMsg: new Date().toISOString()
      });
    }
    return res.status(202).json("Message Sent Successfully!");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/notify/message/user", (req, res) => {
  return res.status(200).json({ count: 0 });
});

router.put("/notify/message/user", (req, res) => {
  return res.status(200).json({ count: 0 });
});

router.get("/notify/message/restaurant", (req, res) => {
  return res.status(200).json({ count: 0 });
});

router.put("/notify/message/restaurant", (req, res) => {
  return res.status(200).json({ count: 0 });
});

// -------------------------------------------------------------
// FRIENDS & COMMUNITY
// -------------------------------------------------------------
router.get("/friend/collection/all", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const friends = await getCollection("friends");
    const userId = authUser ? (authUser._id || authUser.id) : null;
    const userFriends = userId
      ? friends.filter(f => f.fromUsrId === userId || f.toUsrId === userId)
      : friends;
    return res.status(200).json({ data: userFriends });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/friend/request/all", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const requests = await getCollection("friendRequests");
    const userId = authUser ? (authUser._id || authUser.id) : null;
    const myRequests = userId
      ? requests.filter(r => r.fromUsrId === userId || r.toUsrId === userId)
      : requests;
    return res.status(200).json({ data: myRequests });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/friend/request/0/50", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const requests = await getCollection("friendRequests");
    const userId = authUser ? (authUser._id || authUser.id) : null;
    const myRequests = userId
      ? requests.filter(r => (r.toUsrId === userId || r.toUsrId === authUser.email) && r.status !== "Accepted")
      : requests;
    return res.status(200).json({ data: myRequests });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/friend/request", async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    const fromUsrId = req.body.fromUsrId || (authUser ? (authUser._id || authUser.id) : null);
    const fr = await insertOne("friendRequests", {
      ...req.body,
      fromUsrId,
      status: req.body.status || "Pending",
      createdAt: new Date().toISOString()
    });
    return res.status(202).json("Friend Request Sent Successfully!");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/friend/request/accept/:id", async (req, res) => {
  try {
    await updateOne("friendRequests", req.params.id, { status: "Accepted" });
    const reqDoc = await findById("friendRequests", req.params.id);
    if (reqDoc) {
      // Check if already in friends collection
      const friends = await getCollection("friends");
      const exists = friends.find(
        f => (f.fromUsrId === reqDoc.fromUsrId && f.toUsrId === reqDoc.toUsrId) ||
             (f.fromUsrId === reqDoc.toUsrId && f.toUsrId === reqDoc.fromUsrId)
      );
      if (!exists) {
        await insertOne("friends", {
          fromUsrId: reqDoc.fromUsrId,
          fromUsrNm: reqDoc.fromUsrNm,
          fromUsrImg: reqDoc.fromUsrImg || "default-avatar.jpg",
          toUsrId: reqDoc.toUsrId,
          toUsrNm: reqDoc.toUsrNm,
          toUsrImg: reqDoc.toUsrImg || "default-avatar.jpg",
          status: "Accepted",
          createdAt: new Date().toISOString()
        });
      }
    }
    return res.status(202).json("Friend Request Accepted!");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/friend/:qry/:state/:lang", async (req, res) => {
  try {
    const users = await getCollection("users");
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/friend/:qry/:state", async (req, res) => {
  try {
    const users = await getCollection("users");
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/friend/:qry", async (req, res) => {
  try {
    const users = await getCollection("users");
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// DISCOVER API
// -------------------------------------------------------------
router.get("/discover/:location/:skip/:limit", async (req, res) => {
  try {
    const { location, skip = 0, limit = 18 } = req.params;
    const discover = await getCollection("discover");
    const filtered = (location && location.toLowerCase() !== "all")
      ? discover.filter(d => d.location && d.location.toLowerCase() === location.toLowerCase())
      : discover;
    const toReturn = filtered.length > 0 ? filtered : discover;
    const list = toReturn.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: toReturn.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/discover", async (req, res) => {
  try {
    const discover = await getCollection("discover");
    return res.status(200).json({ data: discover });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/discover/:id", async (req, res) => {
  try {
    const item = await findById("discover", req.params.id);
    return res.status(200).json(item || { _id: req.params.id, title: "Discover Hub" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/discover", async (req, res) => {
  try {
    const item = await insertOne("discover", req.body);
    return res.status(202).json({ message: "Discover card created", data: item });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/discover/:id", async (req, res) => {
  try {
    await deleteOne("discover", req.params.id);
    return res.status(200).json({ message: "Discover card deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/discover/upload", upload.single("disImg"), (req, res) => {
  if (!req.file) return res.status(200).json("default-discover.jpg");
  return res.status(200).json(req.file.filename);
});

// -------------------------------------------------------------
// VENUE INFO & SESSIONS
// -------------------------------------------------------------
router.get("/bz-info/:category/:rId/:skip/:limit", async (req, res) => {
  try {
    const info = await getCollection("bzInfo");
    return res.status(200).json({ data: info });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/bz-info", async (req, res) => {
  try {
    const info = await insertOne("bzInfo", req.body);
    return res.status(202).json({ message: "Info saved", data: info });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/admin/session", (req, res) => res.status(200).json({ status: "active" }));
router.post("/user/reset", (req, res) => res.status(200).json({ message: "Reset code sent" }));
router.post("/user/reset/pass", (req, res) => res.status(200).json({ message: "Password updated successfully" }));
router.post("/owner/reset", (req, res) => res.status(200).json({ message: "Reset code sent" }));
router.post("/owner/reset/pass", (req, res) => res.status(200).json({ message: "Password updated successfully" }));

router.post("/creator/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(200).json("default-creator.jpg");
  return res.status(200).json(req.file.filename);
});

router.put("/creator/edit/:id", async (req, res) => {
  try {
    const updated = await updateOne("creators", req.params.id, req.body);
    return res.status(200).json({ message: "Creator updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/creator/delete/:id", async (req, res) => {
  try {
    await deleteOne("creators", req.params.id);
    return res.status(200).json({ message: "Creator deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
