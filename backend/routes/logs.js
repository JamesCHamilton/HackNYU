import express from "express";
const router = express.Router();
import { verifyToken } from "../jwtMiddleware.js";
import Log from "../schemas/Log.js";
import Client from "../schemas/Client.js";

// Route to handle creating a health log entry
router.post("/", verifyToken, async (req, res) => {
  const { bloodGlucose, bloodPressure, weight, timestamp } = req.body;

  try {
    // Create a new health log entry
    const log = new Log({
      bloodGlucose,
      bloodPressure,
      weight,
      timestamp,
      client: req.user._id, // Associate the log with the authenticated client
    });

    // Save the log to the database
    await log.save();

    // Add the log to the client's logs array
    await Client.findByIdAndUpdate(req.user._id, { $push: { logs: log._id } });

    res.status(201).json({ message: "Log created successfully", log });
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch all logs for the authenticated client
router.get("/", verifyToken, async (req, res) => {
  try {
    const client = await Client.findById(req.user._id).populate("logs");
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json({ logs: client.logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };