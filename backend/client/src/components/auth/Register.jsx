import React, { useEffect, useState } from 'react';
import { useRegisterMutation } from '../../redux/api/authapi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MetaData from '../layout/MetaData';


function Register() {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    const { name, email, password } = user;
    const [register, { isLoading, error, data }] = useRegisterMutation();
    console.log(data);
    const {isAuthenticated} =useSelector ((state)=>state.auth)

    const navigate = useNavigate(); // Initialize useNavigate hook
    
    useEffect(()=>{
        if(isAuthenticated){
            navigate("/")
        }
        if(error){
            toast.error(error?.data?.message)
        }
    },[error,isAuthenticated])

    const submitHandler = async (e) => {
        e.preventDefault();
        const signupData = {
            name,
            email,
            password
        };
        try {
            await register(signupData);
            console.log(signupData);
            // Navigate to the home page after successful registration using navigate function
            navigate('/'); 
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }
  
    const onChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }
   
  
    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form
                    className="shadow rounded bg-body"
                    onSubmit={submitHandler}
                >
                    <h2 className="mb-4">Register</h2>

                    <div className="mb-3">
                        <label htmlFor="name_field" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            name="name"
                            value={name}
                            onChange={onChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email_field" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={onChange}
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
                            onChange={onChange}
                        />
                    </div>

                    <button id="register_button" type="submit" className="btn w-100 py-2">
                        {isLoading ? 'Registering...' : 'REGISTER'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
