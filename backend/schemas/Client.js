import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    reasonForJoining: {
        type: String,
        required: true,
    },
    trainers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
    },
    points: {
        type: Number,
        default: 0, // Initialize points to 0
    },
    collectedPhotos: [
        {
            type: String, // Store URLs or file paths to the cat/dog photos
        },
    ],
    completedChallenges: [
        {
            challengeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Challenge", // Reference to a Challenge model (if you have one)
            },
            completedOn: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    lastLogin: {
        type: Date,
        default: Date.now, // Track the last login date
    },
});

const Client = mongoose.models?.Client || mongoose.model("Client", clientSchema);
export default Client;