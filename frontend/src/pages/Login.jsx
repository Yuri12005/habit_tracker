import Form from "../components/Form"

function Login(){
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