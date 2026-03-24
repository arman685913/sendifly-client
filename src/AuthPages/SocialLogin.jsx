import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useAxios from '../Hooks/useAxios';
// import { GoogleAuthProvider } from 'firebase/auth';

const SocialLogin = () => {

    const { signInWithGoogle } = useAuth();

    const location = useLocation()
    const navigate = useNavigate();
    const axiosAuth = useAxios()

    const handleGoogle =  () => {
        signInWithGoogle()
            .then  ( async (result) =>  {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // console.log(token)
                const user = result.user;
                console.log(user)
                if (!location.state) {
                    navigate('/')
                } else {
                    navigate(`/${location.state}`)
                }

                const image = user.photoURL;

                // update in database
                const userInfo = {
                    email: user.email,
                    name: user.displayName,
                    userImg: image,
                    role: 'user',//default
                    created_at: new Date().toLocaleString(),
                    last_log_in: new Date().toLocaleString(),
                }
                const userRes = await axiosAuth.post('/user', userInfo)
                console.log(userRes.data) 

                toast.success("Login With Google Successfully")

            }).catch((error) => {
                const errorMessage = error.message;

                // const email = error.customData.email;
                // // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                console.log(errorMessage)
            });
    }

    return (
        <div className=''>

            {/* Google */}
            <button type='button' onClick={() => handleGoogle()} className="btn w-full bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                Login with Google
            </button>
        </div>
    );
};

export default SocialLogin;