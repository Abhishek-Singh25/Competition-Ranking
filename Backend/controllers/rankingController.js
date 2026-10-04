import db from "../db.js";

export const getRanking = async (req, res) => {
    try {
        const [ranking] = await db.execute(
            `SELECT
                p.id,
                p.name,
                p.email,
                SUM(rr.score) AS total_score,
                MAX(
                    CASE
                        WHEN r.round_number = 3
                        THEN rr.score
                    END
                ) AS round_3_score
             FROM participants p
             JOIN round_results rr
                ON p.id = rr.participant_id
             JOIN rounds r
                ON rr.round_id = r.id
             GROUP BY p.id, p.name, p.email
             HAVING COUNT(DISTINCT r.round_number) = 3
             ORDER BY total_score DESC, round_3_score DESC
             LIMIT 3`
        );

        res.json({
            ranking
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};