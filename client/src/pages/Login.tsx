import { useState } from "react";
import api from "../api/api";


function Login() {


    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");



    async function handleLogin(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();


        if (!email || !password) {

            alert("Please fill all fields");
            return;

        }



        try {


            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );


            console.log(response.data);



            // Store JWT token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Normalize and store user details for the frontend application
            const rawUser = response.data.user;
            const normalizedUser = {
                id: rawUser.id,
                name: rawUser.name || rawUser.full_name || "User",
                email: rawUser.email,
                role: rawUser.role ? rawUser.role.toLowerCase() : "student",
                avatarUrl: rawUser.avatarUrl || (rawUser.role?.toLowerCase() === 'teacher' 
                  ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop')
            };

            localStorage.setItem(
                "ems_current_user",
                JSON.stringify(normalizedUser)
            );

            // Backwards compatibility key
            localStorage.setItem(
                "user",
                JSON.stringify(normalizedUser)
            );

            alert("Login successful");
            window.location.href = "/";



        } catch (error: any) {


            alert(
                error.response?.data?.message ||
                "Login failed"
            );


        }


    }



    return (

        <div className="container vh-100 d-flex justify-content-center align-items-center">


            <div 
                className="card shadow p-4"
                style={{width:"400px"}}
            >


                <h2 className="text-center mb-4">

                    Exam Management System

                </h2>




                <form onSubmit={handleLogin}>


                    <div className="mb-3 text-start">


                        <label className="form-label">
                            Email
                        </label>


                        <input

                            type="email"

                            className="form-control"

                            placeholder="Enter your email"

                            value={email}

                            onChange={
                                (e)=>setEmail(e.target.value)
                            }

                        />


                    </div>






                    <div className="mb-3 text-start">


                        <label className="form-label">
                            Password
                        </label>


                        <input

                            type="password"

                            className="form-control"

                            placeholder="Enter your password"

                            value={password}

                            onChange={
                                (e)=>setPassword(e.target.value)
                            }

                        />


                    </div>






                    <div className="mb-3 form-check text-start">


                        <input

                            type="checkbox"

                            className="form-check-input"

                            id="remember"

                        />


                        <label 
                            className="form-check-label"
                            htmlFor="remember"
                        >

                            Remember me

                        </label>


                    </div>






                    <button 
                        type="submit"
                        className="btn btn-primary w-100"
                    >

                        Login

                    </button>



                </form>



            </div>


        </div>

    );

}


export default Login;