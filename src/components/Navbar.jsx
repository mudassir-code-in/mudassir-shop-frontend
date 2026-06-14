const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Component States
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Authentication State Synchronization with Session Storage
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    useEffect(() => {
        if (user === null) {
            setIsLoggedIn(false);
            localStorage.removeItem('isLoggedIn');
        } else if (user) {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
        }
    }, [user]);

    // Execute Async Backend Logout Process
    const confirmAndExecuteLogout = async () => {
        setShowConfirmModal(false);
        try {
            await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
        } catch (error) {
            // Gracefully handled catch block for standard fallbacks
        } finally {
            setIsLoggedIn(false);
            setIsMobileMenuOpen(false);
            setIsDropdownOpen(false);

            if (typeof setUser === 'function') setUser(null);

            localStorage.clear();
            sessionStorage.clear();

            navigate('/login');
        }
    };

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-50 px-4 md:px-8 py-3.5 transition-all duration-300">
                <div className="w-full max-w-5xl mx-auto flex items-center justify-between">

                    {/* LEFT SECTION: MOBILE HAMBURGER BUTTON + BRAND LOGO */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-zinc-700 hover:text-black p-1 focus:outline-none transition-colors"
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>

                        {/* BRAND LOGO */}
                        <Link to="/" className="text-base md:text-lg font-bold tracking-[0.2em] text-black uppercase font-mono transition-opacity hover:opacity-80">
                            MUDASSIR<span className="font-light text-zinc-300">.SHOP</span>
                        </Link>
                    </div>

                    {/* MIDDLE SECTION: DESKTOP PREMIUM NAVIGATION LINKS */}
                    <div className="hidden md:flex items-center space-x-6 text-[11px] font-bold uppercase tracking-widest font-mono">
                        <Link
                            to="/"
                            className={`transition-colors py-1 px-2 rounded-md ${location.pathname === '/' ? 'text-black bg-zinc-50' : 'text-zinc-400 hover:text-black'}`}
                        >
                            📦 Marketplace
                        </Link>

                        {isLoggedIn && (
                            <Link
                                to="/my-orders"
                                className={`transition-colors py-1 px-2 rounded-md ${location.pathname === '/my-orders' ? 'text-black bg-zinc-50' : 'text-zinc-400 hover:text-black'}`}
                            >
                                📜 My Orders
                            </Link>
                        )}
                    </div>

                    {/* RIGHT SECTION: CART + INTERFACES + SYSTEM ACCESS CONTROLS */}
                    <div className="flex items-center space-x-2 md:space-x-4">

                        {/* SHOPPING CART LEDGER LINK */}
                        <Link to="/cart" className="relative p-2 text-zinc-500 hover:text-black transition-colors" aria-label="Cart">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </Link>

                        {/* DESKTOP INTERFACES GATEWAY */}
                        <div className="hidden md:flex items-center space-x-4">
                            <span className="h-3 w-[1px] bg-zinc-200"></span>

                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="text-[10px] uppercase tracking-wider text-zinc-400 hover:text-black font-bold font-mono flex items-center space-x-1"
                                >
                                    <span>Portals</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-2.5 h-2.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2.5 w-44 bg-white border border-zinc-100 rounded-xl shadow-xl py-1 z-50 font-mono text-[10px] uppercase tracking-wider overflow-hidden">
                                        <Link to="/admin-dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 hover:text-black">🛡️ Admin Panel</Link>
                                        <Link to="/delivery-dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-zinc-600 hover:bg-zinc-50 hover:text-black">🚴 Delivery Agent</Link>
                                    </div>
                                )}
                            </div>

                            {!isLoggedIn && (
                                <>
                                    <span className="h-3 w-[1px] bg-zinc-200"></span>
                                    <div className="flex items-center text-[10px] uppercase tracking-wider font-bold font-mono space-x-4">
                                        <Link to="/login" className="text-zinc-500 hover:text-black transition-colors">Login</Link>
                                        <Link to="/register" className="bg-black text-white px-3.5 py-1.5 rounded-full hover:bg-zinc-800 transition-colors duration-200 shadow-sm">Register</Link>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* DYNAMIC LOGOUT ACCESS CONTROL */}
                        {isLoggedIn && (
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors flex items-center"
                                title="Sign Out"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                            </button>
                        )}

                    </div>
                </div>

                {/* 📱 RESPONSIVE MOBILE EXPANSION DRAWER */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-3.5 pt-3.5 border-t border-zinc-100 bg-white space-y-3 font-mono text-[10px] uppercase tracking-wider font-bold">

                        <div className="flex flex-col space-y-1 px-1">
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`p-2 rounded-lg ${location.pathname === '/' ? 'bg-zinc-50 text-black' : 'text-zinc-500'}`}
                            >
                                📦 Marketplace
                            </Link>

                            {isLoggedIn && (
                                <Link
                                    to="/my-orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`p-2 rounded-lg ${location.pathname === '/my-orders' ? 'bg-zinc-50 text-black' : 'text-zinc-500'}`}
                                >
                                    📜 My Orders
                                </Link>
                            )}
                        </div>

                        <hr className="border-zinc-100" />

                        <div className="px-1 space-y-2">
                            <span className="text-[8px] tracking-widest text-zinc-400 font-bold block px-2">Portals & Roles</span>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <Link to="/admin-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="py-2 bg-zinc-50 rounded-lg text-zinc-600 active:bg-zinc-100 text-center border border-zinc-100">🛡️ Admin</Link>
                                <Link to="/delivery-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="py-2 bg-zinc-50 rounded-lg text-zinc-600 active:bg-zinc-100 text-center border border-zinc-100">🚴 Delivery</Link>
                            </div>
                        </div>

                        {!isLoggedIn && (
                            <>
                                <hr className="border-zinc-100" />
                                <div className="px-1 pb-1 flex flex-col space-y-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center border border-zinc-100 py-2.5 rounded-lg text-zinc-600">Login</Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-black text-white py-2.5 rounded-lg">Register</Link>
                                </div>
                            </>
                        )}

                        {isLoggedIn && (
                            <>
                                <hr className="border-zinc-100" />
                                <div className="px-1 pb-1">
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); setShowConfirmModal(true); }}
                                        className="w-full bg-red-50 text-red-600 py-2.5 rounded-lg border border-red-100"
                                    >
                                        Logout from System
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* 📋 GLOBAL SYSTEM SIGNOUT CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm font-mono text-[10px] uppercase tracking-wider">
                    <div className="bg-white border border-zinc-100 p-5 rounded-2xl shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-red-500 font-bold mb-1.5 text-xs">⚠️ Confirm Sign Out</div>
                        <p className="font-sans normal-case text-zinc-400 mb-5 text-[11px] leading-relaxed">
                            Are you sure you want to log out? You will need to sign in again to manage your portal and cart ledger.
                        </p>
                        <div className="flex space-x-2.5">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="w-1/2 border border-zinc-100 py-2 rounded-xl text-zinc-600 font-bold bg-zinc-50 hover:bg-zinc-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAndExecuteLogout}
                                className="w-1/2 bg-black text-white py-2 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;