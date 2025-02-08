import mongoose from "mongoose"

const clientSchema = new mongoose.Schema = ({
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
    username:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    
    reasonForJoining:{
        type:String,
        required:true,
    },
    trainers:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer"
    }

});
const Client = mongoose.models?.Client || mongoose.model("Client", clientSchema);
export default Client