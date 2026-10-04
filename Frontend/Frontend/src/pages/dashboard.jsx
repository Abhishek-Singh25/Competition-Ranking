import { useEffect, useState } from "react";
import api from "../api";

const Dashboard = () => {
    const [competition, setCompetition] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [formdata, setFormdata]=useState({name:"", email:"", phone:""});
    const [score, setScore]=useState({});
    const [ranking, setRanking]=useState([]);

    useEffect(() => {
        const fetchCompetition = async () => {
            try {
                const res = await api.get("/competition", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setCompetition(res.data.competition);

                const participantRes = await api.get("/participants", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            setParticipants(participantRes.data.participants);

            const rankinRes=await api.get("/ranking",{
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
            });

            setRanking(rankinRes.data.ranking);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCompetition();
    }, []);

    const handleChange=(e)=>{
        setFormdata({...formdata,[e.target.name]:e.target.value});
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            await api.post("/participants/create",formdata,{
                headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}
            });
            alert("Participant added successfully");

            const participantRes = await api.get("/participants", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            setParticipants(participantRes.data.participants);

            setFormdata({name:"", email:"", phone:""});
        }
        catch(error){
            alert(error.response?.data?.message || "failed to add participant");
        }
    };

    const handleScoreChange = (participantId, roundId, value) => {
    setScore({...score,[`${participantId}-${roundId}`]: value});};

    const handleSubmitScore = async (participantId) => {
    try {
        for (let roundId = 1; roundId <= 3; roundId++) {
            const scoreValue = score[`${participantId}-${roundId}`];

            if (scoreValue === undefined || scoreValue === "") {
                alert(`Please enter Round ${roundId} score`);
                return;
            }

            await api.post(
                "/scores",
                {
                    roundId,
                    participantId,
                    score: Number(scoreValue)
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
        }

        alert("All scores submitted successfully");

        const rankinRes = await api.get("/ranking", {
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        });

        setRanking(rankinRes.data.ranking);

    } catch (error) {
        alert(
            error.response?.data?.message || "Failed to submit score"
        );
    }
};

    const handleReset = async () => {
    const confirmReset = window.confirm(
        "Are you sure? This will delete all scores and reset the competition."
    );

    if (!confirmReset) {
        return;
    }

    try {
        await api.delete("/scores/reset",{
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        });

        alert("Competition reset successfully");

        setRanking([]);
        setScore({});

    } catch (error) {
        console.log(error);

        alert(
            error.response?.data?.message || "Failed to reset competition"
        );
    }
};

    return (<>
        <div>
            <h1>Judge Dashboard</h1>

            <button style={{padding:"5px 15px"}} onClick={()=>{
                localStorage.removeItem("token");
                window.location.href="/";
            }}>Logout</button>

            {competition && (
                <div>
                    <h2>{competition.name}</h2>
                    <p>{competition.description}</p>
                    <p>{new Date(competition.date).toLocaleDateString("en-IN")}</p>
                </div>
            )}

            <h2>Participants</h2>

            {participants.map((participant) => (<div className="participant-card">
                <div key={participant.id}>
                    <p>{participant.name}</p>
                    <p>{participant.email}</p>
                    <p>{participant.phone}</p>
                </div>

                <div>
                    <label>Round 1: </label>
                    <input
                    type="number"
                    min="0"
                    max="10"
                    value={score[`${participant.id}-1`] || ""}
                    onChange={(e) =>handleScoreChange(participant.id, 1, e.target.value)}
                    />
                </div>

                <div>
                <label>Round 2: </label>
                <input
                type="number"
                min="0"
                max="10"
                value={score[`${participant.id}-2`] || ""}
                onChange={(e) =>handleScoreChange(participant.id, 2, e.target.value)}
                />
                </div>

                <div>
                <label>Round 3: </label>
                <input
                type="number"
                min="0"
                max="10"
                value={score[`${participant.id}-3`] || ""}
                onChange={(e) =>handleScoreChange(participant.id, 3, e.target.value)}
                />
                </div>

                <button onClick={()=>handleSubmitScore(participant.id)}>Submit Score</button>
            </div>))}

            <hr className="divider"/>

            <h2>Add Participants</h2>

            <form onSubmit={handleSubmit} className="add-part">
                <input type="text" name="name" placeholder="Name" value={formdata.name} onChange={handleChange}/>
                <input type="email" name="email" placeholder="Email" value={formdata.email} onChange={handleChange}/>
                <input type="text" name="phone" placeholder="Phone" value={formdata.phone} onChange={handleChange}/>
                <button type="submit">Add Participant</button>
            </form>
        </div>

        <hr className="divider"/>

        <h2 style={{marginTop:"45px"}}>Final Ranking</h2>

{ranking.length === 0 ? (
    <p>Ranking will appear after all 3 rounds are completed.</p>
) : (
    ranking.map((participant, index) => (
        <div className="participant-card" key={participant.id}>
            <h3>
                {index + 1}. {participant.name}
            </h3>

            <p>Total Score: {participant.total_score}</p>
            <p>Round 3 Score: {participant.round_3_score}</p>
        </div>
    ))
)}
        <button className="reset-btn" onClick={handleReset}>Reset Competition</button>
    </>);
};

export default Dashboard;
