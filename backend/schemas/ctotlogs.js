import mongoose from "mongoose";

const clientToTrainerScehema = new mongoose.Schema({
  roomID: {
    type: String,
    required: true,
  },

  senderRole: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  timeStamp: {
    type: Date,
    default: Date.now,
    required: true,
  },

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },

  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
  },
});

const ClientToTrainer = 
    mongoose.models?.clientToTrainer || mongoose.model("CtoT", clientToTrainerScehema);
export default ClientToTrainer;