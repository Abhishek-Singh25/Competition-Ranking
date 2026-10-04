import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

export const loginAdmin=async(req,res)=>{
    try{
        const {email,password}=req.body;

        const [admins]=await db.execute(
            "SELECT * FROM admins WHERE email=?", [email]
        );

        if(admins.length===0){
            return res.status(401).json({message:"email not found"});
        }
        
        const admin=admins[0];
        const match=await bcrypt.compare(password,admin.password);
        if(!match){
            return res.status(401).json({message:"wrong password"});
        }
        const token=jwt.sign(
            {id: admin.id, email: admin.email},process.env.JWT_SECRET,{expiresIn: "7d"}
        );
        res.json({message:"login successful",token,admin:{id: admin.id, name: admin.name, email: admin.email}});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"server error"});
    }
};