import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    NAME: {
        type: String,
        required: true,
    },
    URL: {
        type: String,
        required: true,
    },
    IMAGE: {
        type: String,
        required: true,
    },
    TEXT: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);