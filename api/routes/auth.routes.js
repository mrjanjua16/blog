import express from "express";
import { google, signin, signup, setAdmin, unSetAdmin } from "../controllers/auth.controller.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

router.post('/sign-up', signup);
router.post('/sign-in', signin);
router.post('/google', google);
router.post('/set-admin/:id', verifyAdmin, setAdmin);
router.post('/remove-admin/:id', verifyAdmin, unSetAdmin);

export default router;