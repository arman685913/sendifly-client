import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { TbPhotoUp } from 'react-icons/tb';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';
import { toast } from 'react-toastify';
import SocialLogin from './SocialLogin';
import axios from 'axios';
import useAxios from '../Hooks/useAxios';

const Register = () => {

    const { createUser, updateUserProfile } = useAuth();

    const axiosAuth = useAxios()


    const location = useLocation()
    const navigate = useNavigate();

    const [eye, setEye] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = data => {
        //update admin info
        const isAdmin = data.name === 'admin' && data.email === 'admin@123.com';
        // console.log(data)
        const { email, password } = data;
        createUser(email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const userProfile = {
                    displayName: data.name, photoURL: userImg
                }
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log(user)
                    }).catch((error) => {
                        const errorMessage = error.message;
                        console.log(errorMessage)
                    });
                // update in database
                const userInfo = {
                    email: data.email,
                    name: data.name,
                    userImg: userImg,
                    role: isAdmin ? 'admin' : 'user',
                    created_at: new Date().toLocaleString(),
                    last_log_in: new Date().toLocaleString(),
                }
                const userRes = await axiosAuth.post('/user', userInfo)
                console.log(userRes.data)

                //state management
                if (!location.state) {
                    navigate('/')
                } else {
                    navigate(`/${location.state}`)
                }
                toast.success("Created Account Successfully")
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
                if (errorMessage == 'Firebase: Error (auth/email-already-in-use).') {
                    toast.error('This email-already-in-use in')
                }
            });
    }

    const [userImg, setUserImg] = useState()

    const handleImg = async (e) => {
        const img = e.target.files[0];
        const formData = new FormData()
        formData.append('image', img)

        const apiKey = import.meta.env.VITE_IMBB_API;

        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData)

        const image = res.data.data.url;
        setUserImg(image)

    }


    return (
        <div>
            <div className="card-body">
                <h1 className='text-3xl font-bold'>Create an Account</h1>
                <p>Register with Sendifly</p>

                <form onSubmit={handleSubmit(onSubmit)} className="fieldset relative">
                    <label className="cursor-pointer flex items-center gap-2">
                        <TbPhotoUp size={32} className="text-lime-600" />
                        <span>Upload Photo</span>
                        <input type="file" {...register('img', {
                            required: true
                        })} onChange={handleImg} className="hidden" />
                    </label>
                    {
                        errors.img?.type === 'required' && (<p className="text-red-500">Image is required</p>)
                    }

                    <label className="">Name</label>
                    <input type="text" {...register('name', {
                        required: true
                    })} className="input w-full focus:border-0" placeholder="Name" />
                    {
                        errors.name?.type === 'required' && (<p className="text-red-500">Name is required</p>)
                    }

                    <label className="">Email</label>
                    <input type="email" className="input w-full focus:border-0" placeholder="Email" required {...register('email', { required: true })} />

                    <label className="">Password</label>
                    <div className='relative'>
                        <input type={eye ? 'password' : 'text'} className="font-semibold input w-full focus:border-0" placeholder="Password"
                            {...register('password', {
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
                            })}
                        />
                        {
                            errors.password?.type === 'required' && (
                                <p className="text-red-500">Password is required</p>
                            )
                        }
                        {
                            errors.password?.type === 'minLength' && (
                                <p className="text-red-500">Password must be at least 6 characters</p>
                            )
                        }
                        {
                            errors.password?.message && (
                                <p className="text-red-500">{errors.password?.message}</p>
                            )
                        }

                        <div className='absolute top-3 right-3'>
                            {
                                eye ? <FaRegEye onClick={() => setEye(!eye)} /> : <FaRegEyeSlash onClick={() => setEye(!eye)} />
                            }
                        </div>
                    </div>

                    <button type='submit' className="btn btn-neutral bg-lime-500 border-0 text-white mt-4">Register</button>
                </form>
                <p>Already have an account? Please <Link to="/login" className='text-lime-600 underline underline-offset-3'>Login</Link></p>

                <div>
                    <SocialLogin></SocialLogin>
                </div>
            </div>
        </div>
    );
};

export default Register;