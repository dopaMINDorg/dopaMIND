import dotenv from "dotenv";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
});

process.on("SIGINT", () => {
  console.log("Received SIGINT");
});

process.on("exit", (code) => {
  console.log("Process exiting with code:", code);
});


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


  // Keep track of process health
  setInterval(() => {

    const memory = process.memoryUsage();

    console.log(
      "❤️ HEARTBEAT",
      new Date().toISOString(),
      {
        pid: process.pid,
        rssMB: Math.round(memory.rss / 1024 / 1024),
        heapMB: Math.round(memory.heapUsed / 1024 / 1024),
      }
    );

  }, 60000);



  // Load cron jobs after dotenv
  await import("./services/emailService.js");
  await import("./cron/emailNotifications.js");
  await import("./cron/dailyBonus.js");



  const PORT = process.env.PORT || 5000;


  app.listen(PORT, () => {

    console.log(
      `🚀 Server running on port ${PORT}`
    );

    console.log(
      "Process PID:",
      process.pid
    );

  });

}


startServer();