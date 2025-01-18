import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, updatePost, getPosts } from "../controllers/post.controller.js"; // Added getPosts

const router = express.Router();

router.get("/", getPosts);  // Now getPosts is defined
router.get("/:id", getPost);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
