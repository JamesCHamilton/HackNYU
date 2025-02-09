import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },

    lastName:{
        type: String,
        required: true,
    },

    dateOfBirth:{
        type: String,
        required: true
    },

    clients:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
        },
    ], 

    certifacateImage:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "CertifacateImage"
        }
    ],

    password:{
          type:String,
          required:true
    },

    username:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },

    phoneNumber:{
        type:String,
        required:true,
        unique:true,
    },

    gender: {
        type:String,
        required:true,
    },

    logs: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Log"
    }],
    yearsOfExperience:{
        type:String,
        required:true,
        min:0,
    },
});

const Trainer = mongoose.models?.Trainer || mongoose.model("Trainer", trainerSchema);
export default Trainer;

