const db = require("../config/db");

exports.createSubscription = (req, res) => {
  const userId = req.user.id;   // comes from JWT middleware
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({ message: "Plan is required" });
  }

  const startDate = new Date();
  const endDate = new Date();

  if (plan === "Basic" || plan === "Premium") {
    endDate.setDate(endDate.getDate() + 30);
  } else {
    endDate.setDate(endDate.getDate() + 7);
  }

  const query = `
    INSERT INTO subscriptions (user_id, plan, start_date, end_date, status)
    VALUES (?, ?, ?, ?, 'active')
  `;

  db.query(query, [userId, plan, startDate, endDate], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "Subscription created successfully",
      subscriptionId: result.insertId
    });
  });
};