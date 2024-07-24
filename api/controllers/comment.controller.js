import Comment from "../models/comment.model.js"
import { errorHandler } from "../utils/error.js"

export const createComment = async (req, res, next) => {
    try {
        const { CONTENT, POST_ID, USER_ID } = req.body
        
        if(USER_ID !== req.user.id) {
            return next(errorHandler(401, "You are not authorized to create comments"));
        }

        const newComment = new Comment({
            CONTENT,
            POST_ID,
            USER_ID,
        });

        await newComment.save();

        res.status(200).json(newComment);
    } catch (error) {
        next(error)
    }
}

export const getPostComments = async (req, res, nect) => {
    try {
        const comments = await Comment.find({ POST_ID: req.params.postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404, "Comment not found"));
        }

        const userIndex = comment.LIKES.indexOf(req.user.id);
        if(userIndex === -1) {
            comment.NUM_LIKES += 1;
            comment.LIKES.push(req.user.id);
        } else {
            comment.NUM_LIKES -= 1;
            comment.LIKES.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};


export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404, "Comment not found"));
        }

        if(comment.USER_ID !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, "You are not authorized to edit this comment"));
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                CONTENT: req.body.CONTENT,
            },
            { new: true }
        );
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment) {
            return next(errorHandler(404, "Comment not found"));
        }

        if(comment.USER_ID !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, "You are not authorized to delete this comment"));
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        next(error);
    }
};


export const getComments = async (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403, "You are not authorized to view all comments"));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;

        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .populate('POST_ID', 'TITLE') // Populate post title
            .populate('USER_ID', 'email'); // Populate user email
        
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });
        res.status(200).json({
             comments, 
             totalComments, 
             lastMonthComments 
            });
        
    } catch (error) {
        next(error);
    }
}