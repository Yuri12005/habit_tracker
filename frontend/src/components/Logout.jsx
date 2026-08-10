import { useNavigate } from "react-router-dom";

function LogoutNav(){
    const navigate = useNavigate()

    const handleLogout = ()=>{
        navigate('/logout');
    }

    return(
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
    )
}

export default LogoutNav