import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useAxios from '../Hooks/useAxios';
import { toast } from 'react-toastify';

const Reset = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      setLoading(true);

      // Backend password reset request
      const { data } = await axios.post("/reset-password", { email, newPassword });

      if (!data.success) {
        return toast.error(data.message || "Reset failed on backend");
      }

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-center">Reset Password</h1>
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <label>New Password</label>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input w-full border px-3 py-2 rounded"
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className={`btn bg-lime-500 text-white py-2 rounded mt-2 hover:bg-lime-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Reset;