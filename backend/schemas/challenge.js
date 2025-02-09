const challengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
});

const Challenge = mongoose.models?.Challenge || mongoose.model("Challenge", challengeSchema);
export default Challenge;