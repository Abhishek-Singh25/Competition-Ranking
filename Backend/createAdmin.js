import bcrypt from "bcryptjs";
import db from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const createAdmin=async()=>{
    try{
        const name="judge";
        const email="judge@gmail.com";
        const password="judge123";

        const hashedPassword=await bcrypt.hash(password,10);

        await db.execute(
            "INSERT INTO admins (name,email,password) VALUES(?,?,?)",[name,email,hashedPassword]
        );
        console.log("judge created successfully");
        process.exit();
    }
    catch(error){
        console.log("error creating judge:", error.message);
        process.exit(1);
    }
};

createAdmin();