import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    CONTENT: {
        type: String,
        required: true
    },
    POST_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    USER_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    LIKES: {
        type: Array,
        default: [],
    },
    NUM_LIKES: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

export default Comment