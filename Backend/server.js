import express from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;
import db from "./db.js";
import adminRoutes from "./routes/adminRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import participantsRoutes from "./routes/participantsRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/competition", competitionRoutes);
app.use("/api/participants", participantsRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/ranking", rankingRoutes);

app.get("/",(req,res)=>{
    res.json({message:"Web App running on my localhost"});
});

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
});
