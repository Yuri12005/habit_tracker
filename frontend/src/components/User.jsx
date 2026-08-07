import { useState, useEffect} from "react";
import api from "../api";

function User(){
    const[username, setUsername] = useState('');

    useEffect(()=>{
        fetchUser();
    }, [])

    const fetchUser = async () =>{
        try{
            const res = await api.get('/api/user/me/');
            setUsername(res.data.username);
        } catch (error){
            console.log("Can`t get username", error)
            setUsername('Error')
        }
    };

    return( 
        <div className="username-container">
            <h1 className="username-text">{username}</h1>
        </div>
    )
}

export default User