import db from "../db.js";

export const createParticipant = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const [result] = await db.execute(
            "INSERT INTO participants (name, email, phone) VALUES (?, ?, ?)",
            [name, email, phone]
        );

        res.status(201).json({
            message: "Participant created successfully",
            participantId: result.insertId
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getParticipants=async(req,res)=>{
    try{
        const [participants]=await db.execute(
            "SELECT * FROM participants ORDER BY id DESC"
        );
        res.json({participants});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"server error"});
    }
};