import express from "express";
import userController from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", userController.getUserProfile);
router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logOut);
router.post("/follow/:id", protectRoute, userController.followUnFollowUser);
router.put("/update/:id", protectRoute, userController.updateUser);

export default router;
