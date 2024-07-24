import express from "express";
import { testController, updateUser, deleteUser, signOut, getUsers, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', testController);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/sign-out', verifyToken, signOut);
router.get('/get-users', verifyToken, getUsers);
router.get('/get-user/:userId', verifyToken, getUser);

export default router;