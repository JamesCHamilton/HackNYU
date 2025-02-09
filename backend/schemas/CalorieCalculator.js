import mongoose from "mongoose";

const calorieCalculatorSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    }
});

const CalorieCalculator = mongoose.models?.CalorieCalculator || mongoose.model("CalorieCalculator", calorieCalculatorSchema);
export default CalorieCalculator;