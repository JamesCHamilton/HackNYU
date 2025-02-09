import express from "express";
const router = express.Router();
import { verifyToken, generateToken } from "../jwtMiddleware.js";
import Client from "../schemas/Client.js";
import Log from "../schemas/Log.js";
import Trainer from "../schemas/Trainer.js";
import Session from "../schemas/Session.js";
// Create a session for a trainer and assign it to a client
router.post("/create-session", verifyToken, async (req, res) => {
  const { clientId, sessionDetails } = req.body; // sessionDetails could include time, date, description, etc.

  try {
    // Find the trainer based on the verified token (trainer ID is included in token payload)
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Find the client to assign the session to
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Create a new session
    const newSession = {
      trainerId: trainer._id,
      clientId: client._id,
      ...sessionDetails,
    };

    // You should create a session schema to store session details
    const session = new Session(newSession);
    await session.save();

    // Optionally: Log the creation of the session in the log collection
    const log = new Log({
      action: "CREATE_SESSION",
      userId: trainer._id,
      details: `Created session for client ${client.name}`,
    });
    await log.save();

    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all sessions for a specific client
router.get("/client-sessions", verifyToken, async (req, res) => {
  try {
    // Ensure the logged-in user is the client
    const client = await Client.findById(req.userId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Fetch the sessions associated with this client
    const sessions = await Session.find({ clientId: client._id })
      .populate("trainerId", "name email") // Populate trainer information
      .exec();

    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all sessions for a trainer
router.get("/trainer-sessions", verifyToken, async (req, res) => {
  try {
    // Ensure the logged-in user is a trainer
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Fetch the sessions associated with this trainer
    const sessions = await Session.find({ trainerId: trainer._id })
      .populate("clientId", "name email") // Populate client information
      .exec();

    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a session details
router.put("/update-session/:sessionId", verifyToken, async (req, res) => {
  const { sessionId } = req.params;
  const { sessionDetails } = req.body; // New session details (time, date, etc.)

  try {
    // Ensure the logged-in user is the trainer
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Find the session and ensure the trainer is the one who created it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ error: "You can only update your own sessions" });
    }

    // Update session details
    Object.assign(session, sessionDetails);
    await session.save();

    res.status(200).json({ message: "Session updated successfully", session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Delete a session
router.delete("/delete-session/:sessionId", verifyToken, async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Ensure the logged-in user is the trainer
    const trainer = await Trainer.findById(req.userId);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Find the session and ensure the trainer is the one who created it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.trainerId.toString() !== trainer._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own sessions" });
    }

    // Delete session
    await session.remove();

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
