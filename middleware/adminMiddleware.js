const db = require("../config/db");

const adminMiddleware = (req, res, next) => {

  const userId = req.user.id;

  const query = "SELECT role FROM users WHERE id = ?";

  db.query(query, [userId], (err, results) => {

    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (results[0].role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only."
      });
    }

    next();

  });

};

module.exports = adminMiddleware;