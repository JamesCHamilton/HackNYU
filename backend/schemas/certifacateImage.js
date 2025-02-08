import mongoose from "mongoose";

const certificateImageSchema = new mongoose.Schema({
    img:
    {
        data: Buffer,
        contentType: String,
        required:true
    },

})

const CertificateImage = mongoose.models?.CertificateImage || mongoose.model("certifacateImage", certificateImageSchema)
  export default CertificateImage