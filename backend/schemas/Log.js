import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    
    bloodSugar:{
        type:String,
        required:false
    },
    bloodGlucose:{
        type:String,
        required:false
    },
    weight:{
        type:String,
        required:false
    },
    timestamp:{
        type:Date,
        required:true
    }
});

  const Log = mongoose.models?.Log || mongoose.model("Log", logSchema)
  export default Log