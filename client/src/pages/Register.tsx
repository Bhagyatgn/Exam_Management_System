import { useState } from "react";
import api from "../api/api";

function Register() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("student");

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await api.post("/auth/register", {
                full_name: name,
                email,
                password,
                role
            });

            alert("Registration successful, please log in");
            window.location.href = "/login";
        } catch (error: any) {
            alert(error.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{width:"400px"}}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3 text-start">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)} />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Role</label>
                        <select className="form-control" value={role} onChange={(e)=>setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
