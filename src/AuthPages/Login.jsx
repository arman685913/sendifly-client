import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import SocialLogin from './SocialLogin';
import useAuth from '../Hooks/useAuth';
import { toast } from 'react-toastify';
import useAxios from '../Hooks/useAxios';

const Login = () => {

    const { loginUser } = useAuth()
    const navigate = useNavigate();

    const location = useLocation()

    const axiosAuth = useAxios()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = data => {
        console.log(data)
        loginUser(data.email, data.password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                console.log(user)
                if (!location.state) {
                    navigate('/')
                } else {
                    navigate(`/${location.state}`)
                }

                // update in database
                const userInfo = {
                    email: user.email,
                    last_log_in: new Date().toLocaleString(),
                }
                const userRes = await axiosAuth.post('/user', userInfo)
                console.log(userRes.data)

                toast.success(`Login Successfully ${user.displayName}`)
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
                if (errorMessage === "Firebase: Error (auth/missing-email).") {
                    toast.warning('Invalid email or password')
                } else if (error.code === "auth/invalid-credential") {
                    toast.error("Invalid email or password")
                } else if (errorMessage === 'Firebase: Error (auth/network-request-failed).'){
                    alert("You're currently offline")
                }
            });

    }

    const [eye, setEye] = useState(true)

    return (
        <div>
            <div className="card-body">
                <h1 className='text-3xl font-bold'>Welcome Back</h1>
                <p>Login with Sendifly</p>

                <form onSubmit={handleSubmit(onSubmit)} className="fieldset relative">

                    <label className="">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input w-full focus:border-0" placeholder="Email" required />

                    <label className="">Password</label>
                    <input type={eye ? 'password' : 'text'} {...register('password', {
                        required: true,
                        minLength: 6,
                        validate: {
                            hasUppercase: (value) =>
                                /[A-Z]/.test(value) || "Password must contain at least one uppercase",
                            hasLowercase: (value) =>
                                /[a-z]/.test(value) || "Password must contain at least one lowercase",
                            hasNumber: (value) =>
                                /[0-9]/.test(value) || "Password must contain at least one number",
                        }
                    })} className="input w-full focus:border-0 font-semibold" placeholder="Password" />

                    {errors.password?.type === "required" && (
                        <p className="text-red-500">Password is required</p>
                    )}
                    {errors.password?.type === "minLength" && (
                        <p className="text-red-500">Password must be at least 6 characters</p>
                    )}
                    {errors.password?.message && (
                        <p className="text-red-500">{errors.password.message}</p>
                    )}
                    <div className='absolute top-28 right-3'>
                        {
                            eye ? <FaRegEye onClick={() => setEye(!eye)} /> : <FaRegEyeSlash onClick={() => setEye(!eye)} />
                        }
                    </div>

                    <div><Link to='/forgot' className="link link-hover underline underline-offset-3">Forgot password?</Link></div>

                    <button type='submit' className="btn btn-neutral bg-lime-500 border-0 text-white mt-4">Login</button>
                </form>

                <p>Don’t have any account? Please <Link state={location.state} to="/register" className='text-lime-600 underline underline-offset-3'>Register</Link></p>

                <div>
                    <SocialLogin></SocialLogin>
                </div>
            </div>
        </div>
    );
};

export default Login;