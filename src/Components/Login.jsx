import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import Admin from './Admin';
// import Dashboard from './Dashboard';
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }
    function handleChangePassword(e) {
        setPassword(e.target.value);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({ email, password })
            })
            const data = await response.json();
            if(!response.ok) {
                alert(data.message);
                return;
            }
            if(data.role === "admin") {
                navigate("/admin");
            } else if(data.role === "user") {
                navigate("/dashboard");
            }
        }catch
(err) {
            console.error("An error occurred: ", err);
        }
        setEmail("");
        setPassword("");
        console.log("Email : ", email);
        console.log("Password: ", password);
    }
  return (
    <>
    <div className='login-container'>
    <h1 className='title'>IT Mangement Information System</h1>
    <form onSubmit={handleSubmit} className='login-form'>
        <input type="email" value={email} placeholder='Enter your mail ID' onChange={handleChangeEmail} required />
        <input type="password" value={password} placeholder='Enter password' onChange={handleChangePassword} required />
        <button type='submit' className='button'>Login</button>
    </form>
    </div>
    
    </>
  )
}

export default Login