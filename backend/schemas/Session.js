import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    dayOfTheWeek: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        default: "scheduled",
    },

})

const Session = mongoose.models?.Session || mongoose.model("Session", sessionSchema);
export default Session;