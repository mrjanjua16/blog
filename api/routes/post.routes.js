import express from "express";
import {createPost} from "../controllers/post.controller.js";
import {verifyToken} from "../utils/verifyUser.js";
import { getPosts, deletePost, updatePost } from "../controllers/post.controller.js";
import { getCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.post("/create-post", verifyToken, createPost);
router.get("/get-posts", getPosts);
router.delete("/delete-post/:postId/:userId", verifyToken, deletePost);
router.put("/update-post/:postId/:userId", verifyToken, updatePost);
router.get("/get-category", getCategory);

export default router;