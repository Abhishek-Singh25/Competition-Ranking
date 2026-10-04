import express from "express";
const router=express.Router();
import { createParticipant, getParticipants } from "../controllers/participantsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/create", authMiddleware, createParticipant);
router.get("/", authMiddleware, getParticipants);

export default router;