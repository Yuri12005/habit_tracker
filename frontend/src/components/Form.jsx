import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"


function Form({route, method}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"
    const handleSubmit = async (e) =>{
        setLoading(true);
        e.preventDefault();

        try{
            const res = await api.post(route, {username, password})
            if (method === 'login'){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate('/')
            } else{
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally{
            setLoading(false)
        }


    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <label htmlFor="username-input" className="form-label">Username</label>
        <input 
            id="username-input"
            className="form-input"
            type="text"
            value = {username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder = "Username"
        />
        <label htmlFor="password-input" className="form-label">Password</label>
        <input 
            id="password-input"
            className="form-input"
            type="password"
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder = "Password"
        />
        <button className="form-button" type="submit">{name}</button>
        {method === "login" ? (
            <p className="form-paragraph">Don`t have an account? <Link to="/register">Register</Link></p>
        ) : (
            <p className="form-paragraph">Already have an account? <Link to="/login">Login</Link></p>
        )}
    </form>

}

export default Form