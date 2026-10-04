import db from "../db.js";

export const createCompetition = async (req, res) => {
    try {
        const { name, description, date } = req.body;

        const [existingCompetition] = await db.execute(
            "SELECT id FROM competitions LIMIT 1"
        );

        if (existingCompetition.length > 0) {
            return res.status(400).json({
                message: "Competition already exists"
            });
        }

        const [result] = await db.execute(
            "INSERT INTO competitions (name, description, date) VALUES (?, ?, ?)",
            [name, description, date]
        );

        const competitionId = result.insertId;

        await db.execute(
            `INSERT INTO rounds (competition_id, round_number, name)
             VALUES
             (?, 1, 'Round 1'),
             (?, 2, 'Round 2'),
             (?, 3, 'Round 3')`,
            [competitionId, competitionId, competitionId]
        );

        res.status(201).json({
            message: "Competition created successfully",
            competitionId
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getCompetition = async (req, res) => {
    try {
        const [competitions] = await db.execute(
            "SELECT * FROM competitions LIMIT 1"
        );

        if (competitions.length === 0) {
            return res.status(404).json({
                message: "Competition not found"
            });
        }

        res.json({
            competition: competitions[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};