import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "UNKNOWN_RECIPIENT_NODE";

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        try {
            const requestPayload = { email, otp };

            // EXECUTE: Transmit cryptographic secure handshake validation token parameters
            const response = await axios.post('https://mudassir-shop-backend.onrender.com/api/auth/verify-email', requestPayload);

            setSuccessMsg(response.data.message || "SECURITY TOKEN VALIDATED. ACCOUNT LIFECYCLE INITIALIZED.");

            // Standard navigation shift routing user identity mapping rules to access logs
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1500);

        } catch (error) {
            setErrorMsg(error.response?.data?.message || "AUTHENTICATION FAULT: INVALID OR EXPIRED SECURITY TOKEN VERIFICATION STRING.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 sm:p-6 font-mono text-zinc-800 selection:bg-black selection:text-white">

            {/* SECURE IDENTITY PASSPORT ENTRY PANEL */}
            <div className="w-full max-w-[360px] sm:max-w-md bg-white p-6 sm:p-10 border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-100/40 mx-auto space-y-6">

                {/* TERMINAL CONTROL HEADER NODE */}
                <div className="text-center space-y-1.5 border-b border-zinc-100 pb-5">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold block">
                        SECURE TWO-FACTOR TUNNEL
                    </span>
                    <h2 className="text-lg font-black text-black uppercase tracking-widest">
                        VERIFY ACCESS TOKEN
                    </h2>
                    <p className="text-[10px] text-zinc-400 font-sans normal-case truncate px-2 mt-1">
                        Transmission route verified to: <span className="text-black font-mono font-bold tracking-normal uppercase">{email}</span>
                    </p>
                </div>

                {/* SYSTEM DIAGNOSTIC ERROR & SUCCESS ALERTS */}
                {errorMsg && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-4 text-[11px] rounded-xl font-bold tracking-wide text-center">
                        ⚠️ SYSTEM EXCEPTION: {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-zinc-900 text-white border border-zinc-800 p-4 text-[11px] rounded-xl font-bold tracking-widest text-center shadow-md animate-pulse">
                        ✅ SUCCESS: {successMsg}
                    </div>
                )}

                {/* PACKET EXECUTION INTERACTION FORM */}
                <form onSubmit={handleVerify} className="space-y-5 text-xs uppercase tracking-wider">
                    <div className="space-y-2">
                        <label className="block font-bold tracking-widest text-zinc-500 text-[10px] text-center">
                            ENTER RECEIVED 6-DIGIT SECURITY SEGMENT *
                        </label>

                        <input
                            type="text"
                            maxLength="6"
                            placeholder="000000"
                            className="w-full p-4 bg-zinc-50/50 border border-zinc-200 font-sans text-center text-2xl font-black tracking-[0.4em] pr-[0.4em] rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all placeholder:tracking-normal placeholder:text-zinc-200 text-black"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-black text-white p-4 font-black tracking-widest text-xs uppercase rounded-xl shadow-md transition-all duration-300 mt-2 flex items-center justify-center space-x-2 active:scale-[0.98] ${loading ? 'opacity-60 cursor-not-allowed bg-zinc-900' : 'hover:bg-zinc-800'
                            }`}
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">🔄</span>
                                <span>COMPILING SECURITY MATRICES...</span>
                            </>
                        ) : (
                            <span>VALIDATE TOKEN ENTRY 🚀</span>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default OtpVerification;