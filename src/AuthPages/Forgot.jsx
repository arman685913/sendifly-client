import React, { useState } from 'react';
// import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useAxios from '../Hooks/useAxios';
import { toast } from 'react-toastify';

const Forgot = () => {
  const axios = useAxios();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email required!");
    }

    try {
      const { data } = await axios.post("/send-code", { email });

      if (data.success) {
        toast.success("Code sent to your email!");
        navigate("/code", { state: { email } });
      } else {
        toast.error(data.message || "Failed to send code");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>

      <form onSubmit={handleForgot} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="input w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="btn bg-lime-500 text-white py-2 rounded mt-2 hover:bg-lime-600 transition"
        >
          Get Code
        </button>
      </form>
    </div>
  );
};

export default Forgot;