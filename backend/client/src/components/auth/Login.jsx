import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../redux/api/authapi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MetaData from "../layout/MetaData";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    const { isAuthenticated, error } = useSelector((state) => state.auth); // Move error declaration here

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
        if (error) {
            toast.error(error?.data?.message);
        }
    }, [error, isAuthenticated]);

    const [login, { isLoading }] = useLoginMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        const loginData = {
            email,
            password
        };
        try {
            await login(loginData);
            // Navigate to the home page after successful login
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form
                    className="shadow rounded bg-body"
                    onSubmit={submitHandler}
                >
                    <h2 className="mb-4">Login</h2>
                    <div className="mb-3">
                        <label htmlFor="email_field" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password_field" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <a href="/password/forgot" className="float-end mb-4">Forgot Password?</a>

                    <button id="login_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
                        {isLoading ? "Authenticating..." : "Login"}
                    </button>

                    {error && <p className="text-danger">{error.message}</p>}

                    <div className="my-3">
                        <a href="/register" className="float-end">New User?</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
