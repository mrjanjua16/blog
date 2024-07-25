import express from "express";
import { google, signin, signup, setAdmin, unSetAdmin } from "../controllers/auth.controller.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/google', google);
router.post('/set-admin/:id', verifyToken, setAdmin);
router.post('/remove-admin/:id', verifyToken, unSetAdmin);

export default router;