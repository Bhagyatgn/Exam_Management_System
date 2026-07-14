import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(e : React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!email || !password){
            alert("Please fill all fields");
            return;
        }
            
    }

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">

            
          <div className="card shadow p-4" style={{ width: "400px" }}>

                <h2 className="text-center mb-4">
                    Exam Management System
                </h2>
                    
                <form onSubmit={handleLogin}>
                    <div className="text-start mb-3">
                        <label htmlFor="email" className="form-label"
                        >Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        
                    </div>

                    <div className="text-start mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="text-start mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="remember"/>
                        <label className="form-check-label" htmlFor="remember">Remember me</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>    
        
        

    )
    
}

export default Login;