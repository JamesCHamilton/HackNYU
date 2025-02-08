import express from "express";
const router = express.Router();
import { verifyToken } from "../utils/jwtMiddleware.js";
import Client from "../schemas/Client.js";
import Log from "../schemas/Log.js";
import bcryptjs from "bcryptjs";


router.post("/searchtrainers", async (req, res) => {
    try {
      const { firstName, lastName, gender, certification, yearsOfExperience, name } = req.query;
  
      // Build the search query dynamically
      const query = {};
  
      // Search by first name or last name
      if (name) {
        query.$or = [
          { firstName: { $regex: name, $options: "i" } }, // Case-insensitive partial match
          { lastName: { $regex: name, $options: "i" } },
        ];
      }
  
      // Search by first name (if provided separately)
      if (firstName) {
        query.firstName = { $regex: firstName, $options: "i" };
      }
  
      // Search by last name (if provided separately)
      if (lastName) {
        query.lastName = { $regex: lastName, $options: "i" };
      }
  
      // Search by gender
      if (gender) {
        query.gender = { $regex: gender, $options: "i" };
      }
  
      // Search by certification (if available in your schema)
      if (certification) {
        query.certifacateImage = { $regex: certification, $options: "i" };
      }
  
      // Search by experience years (if available in your schema)
      if (yearsOfExperience) {
        query.yearsOfExperience = { $gte: yearsOfExperience }; // Greater than or equal to
      }
  
      // Fetch trainers matching the query
      const trainers = await Trainer.find(query)
        .select("-password") // Exclude sensitive information
        .populate('certifacateImage'); // Populate certificate details if needed
  
      if (trainers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No trainers found matching the criteria",
        });
      }
  
      return res.status(200).json({
        success: true,
        trainers,
      });
    } catch (error) {
      console.error("Error searching for trainers:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });
// Get client profile
router.get("/", verifyToken, async (req, res) => {
    try {
        const client = await Client.findById(req.user._id)
            .populate('logs')
            .populate('trainer');
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

// Update client profile
router.put("/profile", verifyToken, async (req, res) => {
    const updates = req.body;
    try {
        // Prevent updating sensitive fields
        delete updates.password;
        delete updates.trainer;
        delete updates.logs;

        const client = await Client.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).populate('trainer');

        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({ error: `${duplicateField} already exists` });
        }
        res.status(500).json({ error: "Error updating profile" });
    }
});

// Change password
router.put("/password", verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const client = await Client.findById(req.user._id);
        if (!client) return res.status(404).json({ error: "Client not found" });

        const isMatch = await bcryptjs.compare(oldPassword, client.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        client.password = await bcryptjs.hash(newPassword, 10);
        await client.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error changing password" });
    }
});

// Assign/Update trainer
router.put("/trainer", verifyToken, async (req, res) => {
    const { trainerId } = req.body;
    try {
        const client = await Client.findByIdAndUpdate(
            req.user._id,
            { trainer: trainerId },
            { new: true }
        ).populate('trainer');

        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating trainer" });
    }
});

// Remove trainer
router.delete("/trainer", verifyToken, async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.user._id,
            { $unset: { trainer: "" } },
            { new: true }
        ).populate('trainer');

        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error removing trainer" });
    }
});

// Delete client account
router.delete("/", verifyToken, async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.user._id);
        if (!client) return res.status(404).json({ error: "Client not found" });

        // Delete associated logs
        await Log.deleteMany({ client: req.user._id });
        
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting account" });
    }
});

// Existing log routes (keep these at the bottom)
router.get("/logs", verifyToken, async (req, res) => {
    try {
        const client = await Client.findById(req.user._id).populate('logs');
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client.logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

router.post("/logs", verifyToken, async (req, res) => {
    const { bloodGlucose, bloodPressure, weight } = req.body;
    try {
        const log = new Log({
            bloodGlucose,
            bloodPressure,
            weight,
            client: req.user._id
        });
        await log.save();
        
        // Add log to client's logs array
        await Client.findByIdAndUpdate(req.user._id, { $push: { logs: log._id } });
        
        res.status(201).json({ message: "Log created successfully", log });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating log" });
    }
});

export {router};