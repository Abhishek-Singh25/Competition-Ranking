import express from "express";
const router=express.Router();
import { createCompetition, getCompetition } from "../controllers/competitionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/create", authMiddleware, createCompetition);
router.get("/", authMiddleware, getCompetition);

export default router;