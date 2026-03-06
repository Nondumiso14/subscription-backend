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

exports.getSubscriptionStatus = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT plan, start_date, end_date, status
    FROM subscriptions
    WHERE user_id = ?
    ORDER BY start_date DESC
    LIMIT 1
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.json({
        active: false,
        message: "No subscription found"
      });
    }

    const subscription = results[0];

    res.json({
      active: subscription.status === "active",
      plan: subscription.plan,
      start_date: subscription.start_date,
      end_date: subscription.end_date
    });
  });
};

exports.getRevenueStats = (req, res) => {

  const revenueQuery = `
    SELECT SUM(amount) AS totalRevenue
    FROM payments
  `;

  const activeQuery = `
    SELECT COUNT(*) AS activeSubscriptions
    FROM subscriptions
    WHERE status = 'active'
  `;

  const expiredQuery = `
    SELECT COUNT(*) AS expiredSubscriptions
    FROM subscriptions
    WHERE status = 'expired'
  `;

  db.query(revenueQuery, (err, revenueResult) => {
    if (err) return res.status(500).json(err);

    db.query(activeQuery, (err, activeResult) => {
      if (err) return res.status(500).json(err);

      db.query(expiredQuery, (err, expiredResult) => {
        if (err) return res.status(500).json(err);

        res.json({
          totalRevenue: revenueResult[0].totalRevenue || 0,
          activeSubscriptions: activeResult[0].activeSubscriptions,
          expiredSubscriptions: expiredResult[0].expiredSubscriptions
        });

      });

    });

  });

};
exports.getMonthlyRevenue = (req, res) => {

  const query = `
    SELECT 
      DATE_FORMAT(payment_date, '%Y-%m') AS month,
      SUM(amount) AS revenue
    FROM payments
    GROUP BY month
    ORDER BY month ASC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });

};