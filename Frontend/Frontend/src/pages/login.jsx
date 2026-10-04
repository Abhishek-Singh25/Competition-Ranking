import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login=()=>{
    const [formdata,setFormdata]=useState({email:"", password:""});

    const navigate=useNavigate();

    const handleChange=(e)=>{
        setFormdata({...formdata,[e.target.name]:e.target.value});
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await api.post("/admin/login",formdata);
            localStorage.setItem("token",res.data.token);
            navigate("/dashboard");
            alert("Login Successful");
        }
        catch(error){
            alert(error.response?.data?.message || "Login Failed");
        }
    };
    return(
        <div className="login">
            <h2>Judge Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="email" name="email" value={formdata.email} onChange={handleChange}/>
                <input type="password" placeholder="password" name="password" value={formdata.password} onChange={handleChange}/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;