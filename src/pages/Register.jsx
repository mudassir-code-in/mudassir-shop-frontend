import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  // State configurations
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessPassword, setAccessPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Status notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const requestPayload = {
      email: email,
      password: password,
      role: role,
      ...(role !== 'user' && { accesspassword: accessPassword })
    };

    try {
      const response = await axios.post('https://mudassir-shop-backned.onrender.com/api/auth/register', requestPayload);

      if (response.status !== 200 && response.status !== 201) {
        throw response;
      }

      setSuccessMsg(response.data.message || "Registration successful! Redirecting to verification page...");

      setTimeout(() => {
        navigate('/verify-email', { state: { email: email } });
      }, 1500);

    } catch (error) {
      const serverResponse = error.response || error;
      const backendMessage = serverResponse.data?.message || "Something went wrong. Please try again.";

      if (serverResponse.status === 400) {
        setErrorMsg(backendMessage);

        // Smart auto-redirect if OTP is already generated
        if (backendMessage.toLowerCase().includes("already sent") || backendMessage.toLowerCase().includes("wait")) {
          setSuccessMsg("An OTP code is already active. Redirecting to verification panel...");
          setTimeout(() => {
            navigate('/verify-email', { state: { email: email } });
          }, 2000);
          return;
        }
      } else if (serverResponse.status) {
        setErrorMsg(backendMessage);
      } else {
        setErrorMsg("Network error: Unable to connect to the server.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 font-mono text-zinc-800 flex items-center justify-center">

      {/* CARD CONTAINER */}
      <div className="max-w-md w-full bg-white p-6 sm:p-10 border border-zinc-200 rounded-2xl shadow-sm mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-2 border-b border-zinc-100 pb-5">
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold block">
            VNTG.CO Platform
          </span>
          <h2 className="text-xl font-bold text-black tracking-wider">
            CREATE AN ACCOUNT
          </h2>
          <div className="pt-1">
            <span className="bg-zinc-100 border border-zinc-200 text-zinc-700 px-3 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
              Selected Role: {role}
            </span>
          </div>
        </div>

        {/* ALERT NOTIFICATIONS */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 text-xs rounded-xl font-bold text-center">
            ⚠️ Error: {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-zinc-900 text-white border border-zinc-800 p-4 text-xs rounded-xl font-bold tracking-wide text-center shadow-sm">
            {successMsg}
          </div>
        )}

        {/* ROLE SELECTION */}
        <div className="space-y-2">
          <label className="block font-bold tracking-wider text-zinc-400 text-[10px] uppercase">
            Select Your Role *
          </label>
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => { setRole('user'); setAccessPassword(''); }}
              className={`p-3 rounded-xl border transition-all duration-200 ${role === 'user'
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-50 text-zinc-400 border-zinc-200 hover:text-zinc-600'
                }`}
            >
              👤 Customer
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setRole('admin')}
              className={`p-3 rounded-xl border transition-all duration-200 ${role === 'admin'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-zinc-50 text-zinc-400 border-zinc-200 hover:text-zinc-600'
                }`}
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setRole('deliveryagent')}
              className={`p-3 rounded-xl border transition-all duration-200 ${role === 'deliveryagent'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-zinc-50 text-zinc-400 border-zinc-200 hover:text-zinc-600'
                }`}
            >
              🚴 Delivery
            </button>
          </div>
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs tracking-wider">

          {/* Email Address Field */}
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-500 text-[10px] uppercase">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="example@domain.com"
              // 🚨 FIX: Removed 'uppercase' class so typing stays normal case
              className="w-full p-4 bg-zinc-50/50 border border-zinc-200 font-sans text-xs text-black rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all placeholder-zinc-300 font-medium normal-case"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-500 text-[10px] uppercase">
              Password *
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 bg-zinc-50/50 border border-zinc-200 font-sans text-xs text-black rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all placeholder-zinc-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Secret Token Field (For Admins and Agents) */}
          {role !== 'user' && (
            <div className="space-y-1.5">
              <label className="block font-bold text-amber-700 text-[10px] uppercase">
                ⚠️ Secure Authorization Key *
              </label>
              <input
                type="password"
                placeholder="Enter admin or agent access key"
                className="w-full p-4 bg-amber-50/20 border border-amber-200 font-sans text-xs text-amber-900 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder-amber-300"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
                disabled={loading}
                required={role !== 'user'}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white p-4 font-bold tracking-widest text-xs uppercase rounded-xl transition-all duration-200 mt-2 flex items-center justify-center space-x-2 active:scale-[0.99] ${loading ? 'opacity-60 cursor-not-allowed bg-zinc-900' : 'hover:bg-zinc-800'
              }`}
          >
            {loading ? (
              <>
                <span className="animate-spin">🔄</span>
                <span>Creating account...</span>
              </>
            ) : (
              <span>Register Now 🚀</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;