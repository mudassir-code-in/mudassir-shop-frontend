import React, { useState } from 'react';
import axios from 'axios';

const DeliveryAgentDashboard = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleDeliverOrder = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError("Order identification string is required to initialize pipeline routing.");
      setApiResponse(null);
      return;
    }

    setLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const response = await axios.post(`https://mudassir-shop-backned.onrender.com/api/order/deliver-order`,
        { orderId: orderId.trim() },
        { withCredentials: true }
      );

      setApiResponse(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Log Exception: The provided tracking hash index does not match server repository entries.");
      } else if (err.response?.data?.message && typeof err.response.data.message === 'string') {
        setError(err.response.data.message);
      } else if (typeof err.response?.data === 'string' && !err.response.data.includes('<!DOCTYPE')) {
        setError(err.response.data);
      } else {
        setError("System Network Drop: Signal handshake denied. Verify endpoint interface heartbeat.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-mono text-xs uppercase tracking-wider text-zinc-400 p-4 sm:p-10 pt-24 selection:bg-white selection:text-black">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP STATUS BAR MAPPING */}
        <div className="w-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CORE AGENT DISPATCH PORTAL ONLINE</span>
          </div>
          <div className="flex items-center gap-6">
            <span>NODES: L-SYS.02 // ASIA-IN</span>
            <span>FREQ: 2400 MHz</span>
          </div>
        </div>

        {/* MAIN DOUBLE COLUMN CONTROL HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* LEFT INTERACTION FRAME (2 COLUMNS) */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-center justify-center w-12 h-12 bg-white text-black font-sans rounded-xl text-xl font-bold shadow-md">
                ⚡
              </div>
              <div>
                <h1 className="text-sm font-black tracking-widest text-white">ROUTE HANDLER</h1>
                <p className="text-[10px] text-zinc-500 font-sans normal-case mt-0.5">Submit dispatch hashes to server grid repositories.</p>
              </div>
            </div>

            <form onSubmit={handleDeliverOrder} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-widest text-zinc-500">
                  INPUT TARGET ORDER ID *
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="E.G., VNTG-9281-X"
                  className="w-full border border-zinc-800 rounded-xl p-4 text-xs text-white tracking-widest focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-all bg-zinc-950 placeholder-zinc-700 font-bold uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-white text-black p-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-md flex items-center justify-center space-x-2 active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'
                  }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-sm">🔄</span>
                    <span>RUNNING PIPELINE COMPILE...</span>
                  </>
                ) : (
                  <span>VERIFY & DEPLOY SHIPMENT 🚀</span>
                )}
              </button>
            </form>

            {/* ERROR STACK FLASH CARD */}
            {error && (
              <div className="border border-red-900/50 bg-red-950/20 text-red-400 p-4 rounded-xl text-[10px] tracking-wide space-y-1.5 border-dashed">
                <div className="font-black text-red-500">⚠️ PIPELINE DISRUPTED EXCEPTION</div>
                <p className="font-sans normal-case text-zinc-400 leading-relaxed">{error}</p>
              </div>
            )}
          </div>

          {/* RIGHT LIVE TELEMETRY STREAM PANEL (3 COLUMNS) */}
          <div className="lg:col-span-3 space-y-6">

            {/* TERMINAL MONITOR STREAM LAYER */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[295px] flex flex-col shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                <span className="text-[10px] font-black tracking-widest text-zinc-500">📊 TELEMETRY BUNDLE INSPECTOR</span>
                <span className="text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded font-bold">LIVE STACK</span>
              </div>

              {!apiResponse && !error && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-zinc-800/40 border-dashed rounded-xl">
                  <span className="text-2xl opacity-40 mb-3">📡</span>
                  <p className="text-zinc-600 font-sans normal-case text-xs max-w-xs">
                    Console idle. Terminal is awaiting active payload buffer inputs from the driver route panel.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-pulse">
                  <span className="text-xl mb-2 text-zinc-500">⚡</span>
                  <p className="text-zinc-500 font-mono text-[10px] tracking-widest">STREAMING PACKET SEGMENTS TO HOST...</p>
                </div>
              )}

              {apiResponse && !loading && (
                <div className="border border-emerald-900/50 bg-emerald-950/10 p-4 rounded-xl text-[11px] flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-emerald-400 font-black mb-3 tracking-widest flex items-center gap-2">
                      <span>●</span> STRUCTURAL SCHEMATICS UNPACKED SUCCESS
                    </div>

                    <div className="space-y-2 font-mono text-zinc-400 text-[11px] bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 max-h-[220px] overflow-y-auto custom-scrollbar">
                      {typeof apiResponse === 'object' ? (
                        Object.entries(apiResponse).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-zinc-600 font-bold uppercase text-[10px]">{key}</span>
                            <span className="text-zinc-300 font-bold tracking-normal break-all pl-4 text-right">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-300">{apiResponse}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* REAL-TIME DIAGNOSTIC METRIC BOXES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <span className="block text-[9px] text-zinc-600 font-bold">LATENCY INTERVAL</span>
                <span className="block text-base font-black text-white mt-1">14ms</span>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <span className="block text-[9px] text-zinc-600 font-bold">DATA PROTOCOL</span>
                <span className="block text-base font-black text-zinc-300 mt-1">POST/JSON</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM FOOTER SECTION */}
        <div className="text-center pt-4 text-[9px] text-zinc-600 font-bold tracking-widest">
          SYSTEM CLUSTER INSTANCE: VNTG.CO LOGISTICS PROTOCOL V2.0.6 // ALL CHANNELS SECURED
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentDashboard;