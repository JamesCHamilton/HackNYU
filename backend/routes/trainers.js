import express from "express";
const router = express.Router();
import { verifyToken, generateToken } from "../jwtMiddleware.js";
import Client from "../schemas/Client.js";
import Trainer from "../schemas/Trainer.js";
import bcryptjs from "bcryptjs";

// Trainer Registration
router.post("/", async (req, res) => {
    const {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        idNumber,
        email,
        username,
        phoneNumber,
        password,
        yearsOfExperience,
        confirmPassword
    } = req.body;

    try {
        if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters!" });
        if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match!" });

        const hashedPassword = await bcryptjs.hash(password, 10);
        const trainer = new Trainer({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            idNumber,
            email,
            username,
            phoneNumber,
            yearsOfExperience,
            password: hashedPassword,
            clients: [],
            certifacateImage: []
        });

        await trainer.save();
        res.status(201).json({ message: "Trainer created successfully", trainer });
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

// Trainer Login
router.put("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const trainer = await Trainer.findOne({ username });
        if (!trainer) return res.status(404).json({ error: "Trainer not found" });
        
        const matchedPassword = await bcryptjs.compare(password, trainer.password);
        if (!matchedPassword) return res.status(401).json({ error: "Invalid credentials" });

        const token = generateToken(trainer);
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

// Get Trainer Profile
router.get("/", verifyToken, async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.user._id)
            .populate('clients')
            .populate('certifacateImage');
            
        if (!trainer) return res.status(404).json({ error: "Trainer not found" });
        res.status(200).json(trainer);
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Unexpected error occured"})
    }
});

// Get Trainer's Clients
router.get("/clients", verifyToken, async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.user._id).populate('clients');
        if (!trainer) return res.status(404).json({ error: "Trainer not found" });
        
        res.status(200).json(trainer.clients);
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Unexpected error occured"})
    }
});

// Get Client Logs
router.get("/clients/logs", verifyToken, async (req, res) => {
    const { clientId } = req.body;
    try {
        const client = await Client.findById(clientId)
            .populate('logs')
            .where({ trainer: req.user._id });

        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client.logs);
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Unexpected error occured"})
    }
});

export {router};