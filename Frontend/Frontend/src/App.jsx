import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import { Children } from "react";

const ProtectedRoutes=({children})=>{
  const token=localStorage.getItem("token");
  if(!token){
    return <Navigate to="/"/>;
  }
  return children;
};

function App(){
    return<>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoutes><Dashboard/></ProtectedRoutes>}/>
      </Routes>
      </BrowserRouter>
    </>
}

export default App;