import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const express = (await import("express")).default;
  const cors = (await import("cors")).default;

  const app = express();

  app.use(cors());
  app.use(express.json());


  app.get("/", (req, res) => {
    res.send("Server running");
  });


  app.get("/test", (req, res) => {
    res.json({
      success: true,
      time: new Date().toISOString(),
    });
  });


  setInterval(() => {
    console.log(
      "❤️ Heartbeat:",
      new Date().toISOString()
    );
  }, 60000);


  // IMPORTANT: load after dotenv
  await import("./services/emailService.js");
  await import("./cron/emailNotifications.js");
  await import("./cron/dailyBonus.js");


  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );
  });
}

startServer();