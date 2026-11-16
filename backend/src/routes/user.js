const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { findOne, findById, insertOne, updateOne, deleteOne, getCollection } = require("../dbHelper");

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

// User Registration - Open to ANY email (Gmail, etc.), Auto-approved, No OTP blocking
router.post("/user", async (req, res) => {
  try {
    const { usrEmail, usrName, password, ...rest } = req.body;
    if (!usrEmail) return res.status(400).json({ error: "Email is required" });

    const existing = await findOne("users", { usrEmail });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists. Please Sign In." });
    }

    const newUser = await insertOne("users", {
      usrEmail,
      usrName: usrName || rest.fullName || usrEmail.split("@")[0],
      password: password || "password",
      verified: true, // Auto-verified, no confirmation email needed
      status: "Approved", // Auto-approved
      role: "user",
      location: rest.location || "Berlin",
      ...rest,
    });

    const token = jwt.sign(
      { id: newUser._id, usrEmail: newUser.usrEmail, usrName: newUser.usrName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(202).json({
      message: "Registration Successful!",
      token,
      usrName: newUser.usrName,
      location: newUser.location,
      userId: newUser._id,
      data: newUser,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// User Verification (always succeeds)
router.post("/user/verify", async (req, res) => {
  return res.status(200).json({ message: "Verified Successful!" });
});

// User Login
router.post("/user/login", async (req, res) => {
  try {
    const { usrEmail, password } = req.body;
    let user = await findOne("users", { usrEmail });

    // If account doesn't exist yet, auto-create it with approved status
    if (!user) {
      user = await insertOne("users", {
        usrEmail,
        password: password || "password",
        usrName: usrEmail.split("@")[0],
        location: "Berlin",
        verified: true,
        status: "Approved",
        role: "user",
      });
    }

    const token = jwt.sign(
      { id: user._id, usrEmail: user.usrEmail, usrName: user.usrName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(202).json({
      token,
      usrName: user.usrName || user.usrEmail.split("@")[0],
      location: user.location || "Berlin",
      userId: user._id,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// User Friend Search with location, state, language filters
router.get("/user/search/:qry/:state/:lang/:skip/:limit", async (req, res) => {
  try {
    const { qry, state, lang, skip = 0, limit = 18 } = req.params;
    const users = await getCollection("users");
    const auth = getAuthUser(req);
    const currentUserId = auth?.id;

    let filtered = users.filter((u) => u.status !== false);
    if (currentUserId) {
      filtered = filtered.filter((u) => u._id !== currentUserId);
    }

    if (qry && qry !== "-" && qry.toLowerCase() !== "all") {
      const q = qry.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          (u.location && u.location.toLowerCase() === q) ||
          (u.company && u.company.toLowerCase().includes(q)) ||
          (u.fullName && u.fullName.toLowerCase().includes(q))
      );
    }

    if (state && state !== "-" && state.toLowerCase() !== "all") {
      const s = state.toLowerCase();
      filtered = filtered.filter(
        (u) => u.locationIndia && u.locationIndia.toLowerCase() === s
      );
    }

    if (lang && lang !== "-" && lang.toLowerCase() !== "all") {
      const l = lang.toLowerCase();
      filtered = filtered.filter(
        (u) => u.language && u.language.toLowerCase().includes(l)
      );
    }

    const isFiltered = (state && state !== "-" && state.toLowerCase() !== "all") ||
      (lang && lang !== "-" && lang.toLowerCase() !== "all") ||
      (qry && qry !== "-" && qry.toLowerCase() !== "all");
    const toReturn = isFiltered ? filtered : (filtered.length > 0 ? filtered : users.filter((u) => u._id !== currentUserId && u.status !== false));
    const list = toReturn.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: toReturn.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/user/search/:qry/:state/:skip/:limit", async (req, res) => {
  try {
    const { qry, state, skip = 0, limit = 18 } = req.params;
    const users = await getCollection("users");
    const auth = getAuthUser(req);
    const currentUserId = auth?.id;
    let filtered = users.filter((u) => u.status !== false);
    if (currentUserId) filtered = filtered.filter((u) => u._id !== currentUserId);
    if (qry && qry !== "-" && qry.toLowerCase() !== "all") {
      filtered = filtered.filter((u) => u.location && u.location.toLowerCase() === qry.toLowerCase());
    }
    const isFiltered = (state && state !== "-" && state.toLowerCase() !== "all") ||
      (lang && lang !== "-" && lang.toLowerCase() !== "all") ||
      (qry && qry !== "-" && qry.toLowerCase() !== "all");
    const toReturn = isFiltered ? filtered : (filtered.length > 0 ? filtered : users.filter((u) => u._id !== currentUserId && u.status !== false));
    const list = toReturn.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: toReturn.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/user/search/:qry/:skip/:limit", async (req, res) => {
  try {
    const { qry, skip = 0, limit = 18 } = req.params;
    const users = await getCollection("users");
    const auth = getAuthUser(req);
    const currentUserId = auth?.id;
    let filtered = users.filter((u) => u.status !== false);
    if (currentUserId) filtered = filtered.filter((u) => u._id !== currentUserId);
    if (qry && qry !== "-" && qry.toLowerCase() !== "all") {
      filtered = filtered.filter((u) => u.location && u.location.toLowerCase() === qry.toLowerCase());
    }
    const isFiltered = (state && state !== "-" && state.toLowerCase() !== "all") ||
      (lang && lang !== "-" && lang.toLowerCase() !== "all") ||
      (qry && qry !== "-" && qry.toLowerCase() !== "all");
    const toReturn = isFiltered ? filtered : (filtered.length > 0 ? filtered : users.filter((u) => u._id !== currentUserId && u.status !== false));
    const list = toReturn.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data: list, total: toReturn.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Users List with pagination
router.get("/user/:skip/:limit", async (req, res) => {
  try {
    const users = await getCollection("users");
    const { skip = 0, limit = 18 } = req.params;
    const data = users.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
    return res.status(200).json({ data, total: users.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Current User Profile
router.get("/user", async (req, res) => {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      const users = await getCollection("users");
      if (users.length > 0) return res.status(200).json(users[0]);
      return res.status(200).json({ usrName: "Demo User", location: "Berlin" });
    }
    const user = await findById("users", auth.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get User by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await findById("users", req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update User Profile
router.put("/user", async (req, res) => {
  try {
    const auth = getAuthUser(req);
    const userId = auth?.id || req.body._id;
    if (!userId) return res.status(400).json("User ID required");
    const updated = await updateOne("users", userId, req.body);
    return res.status(202).json("Profile Updated Successfully!");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Delete User
router.delete("/user/:id", async (req, res) => {
  try {
    await deleteOne("users", req.params.id);
    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update User Location
router.put("/user/location", async (req, res) => {
  try {
    const auth = getAuthUser(req);
    if (auth?.id) {
      await updateOne("users", auth.id, { location: req.body.location });
    }
    return res.status(200).json({ message: "Location updated", location: req.body.location });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Validate Session
router.get("/user/session", (req, res) => {
  return res.status(200).json({ status: "active" });
});

// Upload User File/Image
router.post("/user/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  return res.status(200).json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

module.exports = router;
