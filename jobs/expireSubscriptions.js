const cron = require("node-cron");
const db = require("../config/db");

cron.schedule("* * * * *", () => {
  console.log("Running daily subscription expiry check...");

  const query = `
    UPDATE subscriptions
    SET status = 'expired'
    WHERE end_date < NOW()
    AND status = 'active'
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error updating expired subscriptions:", err);
    } else {
      console.log(`Expired subscriptions updated: ${result.affectedRows}`);
    }
  });
});