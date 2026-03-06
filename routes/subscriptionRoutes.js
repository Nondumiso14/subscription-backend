const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/create", authMiddleware, controller.createSubscription);
router.get("/status", authMiddleware, controller.getSubscriptionStatus);

router.get("/admin/revenue", authMiddleware, adminMiddleware, controller.getRevenueStats);
router.get("/test", (req, res) => {
  res.json({ message: "Subscription route working" });
});

module.exports = router;