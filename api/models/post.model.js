import mongoose from 'mongoose';
import mongooseAutoIncrement from 'mongoose-sequence';

// Initialize the sequence plugin with the mongoose instance
const AutoIncrement = mongooseAutoIncrement(mongoose);

const PostSchema = new mongoose.Schema(
    {
        SEQNUM: { 
            type: Number,
            unique: true
        },
        CONTENT: { 
            type: String,
            required: true 
        },
        TITLE: { 
            type: String,
            required: true 
        },
        AUTHOR: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        IMAGE: { 
            type: String,
            default: "https://www.blogtyrant.com/wp-content/uploads/2019/07/types-of-blog-posts.png"
        },
        CATEGORY: {
            type: String,
            default: "Development"
        },
        SLUG: {
            type: String,
            required: true,
            unique: true
        },
    }, 
    { timestamps: true }
);

PostSchema.plugin(AutoIncrement, { inc_field: 'SEQNUM' });

const Post = mongoose.model('Post', PostSchema);
export default Post;
