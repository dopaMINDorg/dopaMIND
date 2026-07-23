import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import './services/emailService.js'
import "./cron/emailNotifications.js";
import "./cron/dailyBonus.js";



const app = express()

app.use(cors())
app.use(express.json())
app.get("/test", (req, res) => {
  res.json({ message: "Server works" });
});

app.get('/', (req, res) => {
  res.send('Server running')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});