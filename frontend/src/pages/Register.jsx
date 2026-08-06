import Form from "../components/Form"
import "../styles/Login-registration.css"

function Register(){
    return( 
    <div className="split-page">
        <div className="text-section">
            <h1 className="text-header">BUILD LASTING HABITS</h1>
            <p className="text-paragraph">Achieve your goals one day at a time</p>    
        </div>
        <div className="background-form"><Form route='/api/user/register/' method="register" /></div>
    </div>
    )
}

export default Register