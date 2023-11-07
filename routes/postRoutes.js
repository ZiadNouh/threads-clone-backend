import express from "express";
import postController from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, postController.getFeedPosts);
router.get("/:id", postController.getPost);
router.get("/user/:username", postController.getUserPosts);
router.post("/create", protectRoute, postController.createPost);
router.delete("/:id", protectRoute, postController.deletePost);
router.put("/like/:id", protectRoute, postController.likeUnlikePost);
router.put("/reply/:id", protectRoute, postController.replyToPost);

export default router;
