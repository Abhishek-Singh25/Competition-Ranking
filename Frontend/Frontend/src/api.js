import axios from "axios";

const api=axios.create({
    baseURL: "https://competition-ranking-backend.onrender.com/api"
});

export default api;
