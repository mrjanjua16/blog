import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createPost = async (req, res, next) => {
/*    if (!req.user.isAdmin) {
        return res.status(401).json({
            success: false,
            message: "You are not authorized to create a post"
        });
    }
*/
    if (!req.body.CONTENT || !req.body.TITLE) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    try {
        const existingPost = await Post.findOne({ SLUG: req.body.TITLE.toLowerCase().replace(/\s/g, "-") });
        if (existingPost) {
            return res.status(400).json({
                success: false,
                message: "Title already exists, please change the title."
            });
        }
    } catch (error) {
        return next(error);
    }

    const SLUG = req.body.TITLE.toLowerCase().replace(/\s/g, "-");
    const AUTHOR = req.user.id;
    const CATEGORY = req.body.CATEGORY;
    const IMAGE = req.body.IMAGE;
    const CONTENT = req.body.CONTENT;

    const newPost = new Post({
        TITLE: req.body.TITLE,
        CONTENT: CONTENT,
        SLUG: SLUG,
        AUTHOR: AUTHOR,
        IMAGE: IMAGE,
        CATEGORY: CATEGORY
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}


export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        
        const query = {
            ...(req.query.USERID && { AUTHOR: req.query.USERID }),
            ...(req.query.category && { CATEGORY: req.query.category}),
            ...(req.query.TITLE && { TITLE: req.query.TITLE }),
            ...(req.query.CONTENT && { CONTENT: req.query.CONTENT }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { TITLE: { $regex: req.query.searchTerm, $options: "i" }},
                    { CONTENT: { $regex: req.query.searchTerm, $options: "i" }}
                ],
            }),
        };

        if (req.query.slug) {
            query.SLUG = req.query.slug;
        }

        const posts = await Post.find(query)
            .populate('AUTHOR', 'email')  
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

    
        const totalPosts = await Post.countDocuments(query);

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

    } catch (error) {
        next(error);
    }
};



export const deletePost = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'Only admin user can delete a post'));
    }
    if(req.user.id !== post.AUTHOR.toString()) {
        return next(errorHandler(403, 'Owner of this post can edit it.'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }
    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'Only admin user can update a blog'));
    }
    if(req.user.id !== post.AUTHOR.toString()) {
        return next(errorHandler(403, 'Owner of this post can edit it.'));
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                TITLE: req.body.TITLE,
                CONTENT: req.body.CONTENT,
                IMAGE: req.body.IMAGE,
                CATEGORY: req.body.CATEGORY,
            },
        }, {new: true});
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
}