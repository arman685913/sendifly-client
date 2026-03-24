import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useAxios from '../Hooks/useAxios'
import { toast } from 'react-toastify';

const Code = () => {
  const axios = useAxios(); 
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/forgot");
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalCode = code.join("");

    if (finalCode.length !== 6) {
      return toast.error("Enter full 6-digit code!");
    }

    try {
      const { data } = await axios.post("/verify-code", {
        email,
        code: finalCode
      });

      if (data.success) {
        toast.success("Code verified!");
        navigate("/reset", { state: { email } });
      } else {
        toast.error(data.message || "Invalid code!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Enter Verification Code</h1>

      <div className="flex justify-between gap-2 mb-4">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-12 h-12 text-center border rounded text-xl"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="btn bg-lime-500 text-white py-2 w-full rounded hover:bg-lime-600 transition"
      >
        Verify Code
      </button>
    </div>
  );
};

export default Code;