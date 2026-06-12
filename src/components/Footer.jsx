import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-zinc-100 py-6 font-mono text-[10px] text-zinc-400 uppercase tracking-widest mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">

                {/* LEFT SIDE: BRAND & DEV INFO */}
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
                    <span className="text-black font-bold tracking-wider">
                        © {currentYear} VNTG.CO
                    </span>
                    <span className="hidden sm:inline text-zinc-200">|</span>
                    <span className="lowercase font-sans text-zinc-400">
                        engineered by Mudassir Ahmad — 16 y/o student & full-stack developer
                    </span>
                </div>

                {/* RIGHT SIDE: STATUS INDICATOR */}
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                    <span className="text-[9px] text-black font-bold">
                        All Systems Operational
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
