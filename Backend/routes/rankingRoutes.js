import express from "express";
const router=express.Router();
import { getRanking } from "../controllers/rankingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.get("/", authMiddleware, getRanking);

export default router;
