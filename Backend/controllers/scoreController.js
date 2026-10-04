import db from "../db.js";

export const addScore = async (req, res) => {
    try {
        const { roundId, participantId, score } = req.body;

        if (score < 0 || score > 10) {
            return res.status(400).json({
                message: "Score must be between 0 and 10"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO round_results
            (round_id, participant_id, score)
            VALUES (?, ?, ?)`,
            [roundId, participantId, score]
        );

        res.status(201).json({
            message: "Score added successfully",
            resultId: result.insertId
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getScores = async (req, res) => {
    try {
        const [scores] = await db.execute(
            `SELECT
                rr.id,
                rr.participant_id,
                p.name AS participant_name,
                r.round_number,
                r.name AS round_name,
                rr.score
             FROM round_results rr
             JOIN participants p ON rr.participant_id = p.id
             JOIN rounds r ON rr.round_id = r.id
             ORDER BY p.id, r.round_number`
        );

        res.json({
            scores
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};