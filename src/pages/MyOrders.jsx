import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyOrders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    // READ: Fetch authenticated user transaction logs from the data node
    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            setErrorMsg('');

            const response = await axios.get(
                'https://mudassir-shop-backned.onrender.com/api/order/get-my-orders',
                { withCredentials: true }
            );

            if (response.data && response.data.orders) {
                setOrders(response.data.orders);
            } else if (Array.isArray(response.data)) {
                setOrders(response.data);
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Inbound Stream Exception: Failed to synchronize historical order ledgers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] font-mono text-xs uppercase flex items-center justify-center text-zinc-400">
                🔄 Synchronizing secure transaction ledger entries...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-mono text-xs uppercase tracking-wider text-zinc-800 p-3 sm:p-8 pt-24 selection:bg-black selection:text-white">
            <div className="w-full max-w-4xl mx-auto space-y-6">

                {/* ERROR CONSOLE NOTIFICATION LAYER */}
                {errorMsg && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-bold">
                        ⚠️ ERROR SYSTEM REPORT: {errorMsg}
                    </div>
                )}

                {/* ARCHIVE GRID DASHBOARD CONTROL HEADER */}
                <div className="flex justify-between items-center border-b border-zinc-200 pb-5 mb-2 px-1">
                    <div>
                        <h1 className="text-sm sm:text-base font-black text-black tracking-widest">📜 ARCHIVAL ACCOUNT RECORDS</h1>
                        <p className="text-zinc-400 text-[9px] mt-1 font-sans normal-case hidden sm:block">Verified shipping invoices matching client deployment hashes.</p>
                    </div>
                    <span className="bg-zinc-100 border border-zinc-200 text-zinc-900 px-3 py-1 rounded-full text-[9px] font-bold">
                        LOGGED ENTRIES: {orders?.length || 0}
                    </span>
                </div>

                {(!orders || orders.length === 0) ? (
                    <div className="border border-dashed border-zinc-200 rounded-2xl p-20 text-center text-zinc-400 bg-white shadow-sm">
                        📭 Empty Manifest: No active purchase operations synchronized in database files.
                    </div>
                ) : (

                    /* TRANSACTION BLOCK SEGMENTS REPOSITORY */
                    <div className="space-y-4">
                        {orders.map((order, index) => {

                            // RUNTIME COMPILING: Calculate aggregated value sum from live structural arrays
                            const calculatedTotal = (order?.products || []).reduce((sum, item) => {
                                const itemPrice = Number(item?.price || 0);
                                const itemQty = Number(item?.quantity || 1);
                                return sum + (itemPrice * itemQty);
                            }, 0);

                            return (
                                <div
                                    key={order?._id || index}
                                    className="bg-white border border-zinc-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-zinc-200 hover:shadow-md transition-all duration-300 space-y-5"
                                >
                                    {/* PANEL META DATA STRIP */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-100 pb-4">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-zinc-400 tracking-widest">
                                                BATCH ID: <span className="text-black font-mono font-black bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded">#{order?._id ? order._id.slice(-8) : index}</span>
                                            </div>
                                            <div className="text-[9px] text-zinc-400 font-sans normal-case">
                                                Timestamp initialized: {order?.createdAt ? new Date(order.createdAt).toUTCString() : 'Pending Queue'}
                                            </div>
                                        </div>

                                        {/* TELEMETRY STATE METRIC COUNTERS */}
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                                            {order?.isDelivered ? (
                                                <span className="text-[9px] font-black tracking-widest border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                                                    ● RELEASE DISPATCH COMPLETE
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black tracking-widest border border-amber-200 bg-amber-50 text-amber-700 px-3 py-1 rounded-full animate-pulse">
                                                    ○ PIPELINE PROCESSING TRANSIT
                                                </span>
                                            )}

                                            <span className="text-sm sm:text-base font-black font-mono text-black">
                                                ${calculatedTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ITERATIVE ASSET ARRAY SUITE */}
                                    <div className="divide-y divide-zinc-50 space-y-3">
                                        {(order?.products || []).map((item, idx) => {
                                            const finalImageUrl = item?.image || item?.productid?.image || "";

                                            return (
                                                <div key={item?._id || idx} className="flex items-center gap-4 pt-3 first:pt-0">

                                                    {/* THUMBNAIL COMPARTMENT */}
                                                    <div className="w-14 h-14 bg-[#fcfcfc] border border-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                                                        {finalImageUrl ? (
                                                            <img
                                                                src={finalImageUrl}
                                                                alt="System Component Catalog Inventory"
                                                                className="w-full h-full object-contain p-1"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://placehold.co/100x100?text=ASSET';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-[8px] text-zinc-300 font-black font-mono">NULL_BUF</span>
                                                        )}
                                                    </div>

                                                    {/* SPECIFICATIONS SCHEMATICS FIELDS */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-sans text-xs font-bold text-zinc-900 normal-case truncate">
                                                            {item?.productid?.name || "System Stock Unit"}
                                                        </h4>
                                                        <div className="flex items-center space-x-2 text-[9px] text-zinc-400 font-mono mt-1">
                                                            <span className="bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded text-zinc-500 font-bold">QTY: {item?.quantity || 1}</span>
                                                            <span className="text-zinc-200">|</span>
                                                            <span>UNIT RATE: ${Number(item?.price || 0).toFixed(2)}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* LOCALIZED TERMINAL ROUTING INTERFACE (ADDRESS) */}
                                    {order?.addressid && (
                                        <div className="pt-3.5 border-t border-zinc-100 text-[10px] text-zinc-500 font-sans normal-case leading-relaxed">
                                            📍 <span className="font-mono uppercase font-black text-[9px] text-zinc-400 mr-1 tracking-wider">ENDPOINT DESTINATION STORAGE NODE:</span>
                                            <span className="text-zinc-700 font-medium">
                                                {typeof order.addressid === 'string'
                                                    ? order.addressid
                                                    : `${order.addressid?.address || order.addressid?.street || 'N/A'}, ${order.addressid?.city || ''}`}
                                            </span>
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyOrders;