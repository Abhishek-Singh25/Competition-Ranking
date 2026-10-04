import express from "express";
const router=express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import { addScore, getScores, resetScores } from "../controllers/scoreController.js";

router.post("/", authMiddleware, addScore);
router.get("/", authMiddleware, getScores);
router.delete("/reset", authMiddleware, resetScores);

export default router;
