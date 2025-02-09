import express from "express";
const router = express.Router();
import { verifyToken, generateToken } from "../jwtMiddleware.js";
import Client from "../schemas/Client.js";
import Log from "../schemas/Log.js";
import bcryptjs from "bcryptjs";
import Trainer from "../schemas/Trainer.js";
import axios from "axios";

// Helper function to fetch and save a random photo
const fetchAndSaveRandomPhoto = async (clientId, animal) => {
    let photoUrl;
    if (animal === "cat") {
        const response = await axios.get("https://cataas.com/cat", {
            responseType: "arraybuffer",
        });
        photoUrl = `data:image/jpeg;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
    } else if (animal === "dog") {
        const response = await axios.get("https://dog.ceo/api/breeds/image/random");
        photoUrl = response.data.message;
    } else {
        throw new Error("Invalid animal type");
    }

    const client = await Client.findById(clientId);
    if (!client) {
        throw new Error("Client not found");
    }

    if (client.points < 100) {
        throw new Error("Not enough points to collect a photo");
    }

    client.collectedPhotos.push(photoUrl);
    client.points -= 100;
    await client.save();

    return photoUrl;
};

// Client Registration
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, gender, idNumber, username, tosAccepted, dateOfBirth, reasonForJoining } = req.body;

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new client
        const client = new Client({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            gender,
            idNumber,
            username,
            dateOfBirth,
            reasonForJoining,
            tosAccepted,
            points: 0, // Initialize points to 0
            collectedPhotos: [], // Initialize empty array for collected photos
            completedChallenges: [], // Initialize empty array for completed challenges
            lastLogin: new Date(), // Set last login to current date
        });

        // Save the client to the database
        await client.save();

        res.status(201).json({ message: "Client created successfully", client });
    } catch (error) {
        console.error("Error creating client:", error);
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({ error: `${duplicateField} already exists` });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await Client.findOne({ username });
        if (!client) return res.status(404).json({ error: "Client not found" });
        
        const matchedPassword = await bcryptjs.compare(password, client.password);
        if (!matchedPassword) return res.status(401).json({ error: "Invalid credentials" });

        const token = generateToken(client);
        res.cookie("token", token, { 
            maxAge: 9000000,
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            path: "/",
            sameSite: 'Lax'  
        });
        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                error: "Validation Error",
                details: errors
            });
          }
          if (error.code === 11000) {
            // Extract the duplicate field(s)
            const duplicateField = Object.keys(error.keyValue)[0];
            const duplicateValue = error.keyValue[duplicateField];
            res.status(400).json({
              error: `Duplicate value found: ${duplicateField} '${duplicateValue}' is already in use.`,
            });
          }
      res.status(500).json({ error: "Error creating/updating doctor", error });
    }
});


// Collect Random Photo
router.post("/collectRandomPhoto", verifyToken, async (req, res) => {
    try {
        const { animal } = req.body; // Expecting "cat" or "dog" in the request body
        const clientId = req.user._id; // Get clientId from the authenticated user

        const photoUrl = await fetchAndSaveRandomPhoto(clientId, animal);
        res.status(200).json({ message: "Photo collected successfully!", photoUrl });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Search Trainers
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

// Get Client Profile
router.get("/", verifyToken, async (req, res) => {
    try {
        const client = await Client.findById(req.user._id)
            .populate('logs')
            .populate('trainers');
        if (!client) return res.status(404).json({ error: "Client not found" });

        const latestLog = client.logs.length > 0 ? client.logs[client.logs.length - 1] : null;
        const latestMetrics = latestLog ? {
            bloodGlucose: latestLog.bloodGlucose,
            bloodPressure: latestLog.bloodPressure,
            weight: latestLog.weight,
            recordedAt: latestLog.createdAt // Assuming `createdAt` stores the timestamp of the log
        } : null;

        res.status(200).json({ client, latestMetrics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

// Update Client Profile
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

// Change Password
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

// Assign/Update Trainer
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

// Remove Trainer
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

// Delete Client Account
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

// Create Health Log
router.post("/clients/logs", verifyToken, async (req, res) => {
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

// Get Client Logs
router.get("/clients/logs", verifyToken, async (req, res) => {
    try {
        const client = await Client.findById(req.user._id).populate('logs');
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client.logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

export { router };