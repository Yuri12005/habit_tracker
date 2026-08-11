import Form from "../components/Form"
import { useEffect } from "react";
import '../styles/Login-registration.css'

function Login(){
    useEffect(() => {
            localStorage.clear();
        }, []);

    return( 
    <div className="split-page">
        <div className="text-section">
            <h1 className="text-header">WELCOME BACK</h1>
            <p className="text-paragraph">Ready to achieve your goals?</p>    
        </div>
        <div className="background-form">
            <Form route='/api/token/' method="login" />
        </div>
    </div>
    )
}

export default Login