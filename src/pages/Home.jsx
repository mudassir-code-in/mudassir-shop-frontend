import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active Context Description Overlay Layer State
  const [selectedDescription, setSelectedDescription] = useState(null);

  // NEW STATE FOR FULLSCREEN IMAGE VIEWPORT MATRIX
  const [selectedImage, setSelectedImage] = useState(null);

  // READ: Query global distributed product schemas from remote cluster node
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await axios.get(`${API_URL}/api/product/get-all-products`);

      if (response.data && response.data.allProducts) {
        setProducts(response.data.allProducts);
      }
    } catch (error) {
      setErrorMsg("Failed to synchronize active database index inventory repositories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // MUTATE: Initialize order stream addition protocol data packets
  const handleAddToCart = async (productId) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');

      await axios.post(
        `${API_URL}/api/product/add-cart`,
        { productId },
        { withCredentials: true }
      );

      setSuccessMsg("Item entry configured and mapped to your cart context successfully.");
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("Session Expired: Authentication credentials required. Verify profile token.");
      } else {
        setErrorMsg(error.response?.data?.message || "Server engine denied validation append request parameters.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 font-mono text-xs uppercase flex items-center justify-center text-zinc-400">
        🔄 Compiling system product catalogs into localized ledger...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-mono text-xs uppercase tracking-wider text-zinc-800 p-3 sm:p-8 pt-24">
      <div className="w-full max-w-5xl mx-auto">

        {/* SYSTEM BROADCAST FLASH PANELS */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-bold">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-center font-bold tracking-widest shadow-md">
            ✅ {successMsg}
          </div>
        )}

        {/* CATALOG CONTROL HEADER BAR */}
        <div className="flex justify-between items-center border-b border-zinc-200 pb-5 mb-8 px-1">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-black tracking-widest">SHOP</h1>
          </div>
          <span className="bg-zinc-100 border border-zinc-200 text-zinc-900 px-3 py-1 rounded-full text-[9px] font-bold">
            ENTRIES: {products.length}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-zinc-200 rounded-2xl p-20 text-center text-zinc-400 bg-white">
            📭 Database matrix clear. No structural entities matched in indexing data rows.
          </div>
        ) : (

          /* INVENTORY LIST BLOCK MATRIX */
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-100/50 transition-all duration-300 p-4 flex flex-row gap-4 sm:gap-6 w-full h-44 sm:h-48"
              >
                {/* 01: IMAGE BINARY STORAGE BOX RENDER FRAME */}
                <div
                  onClick={() => product.image && setSelectedImage({ src: product.image, name: product.name })}
                  className={`relative w-28 sm:w-40 h-full bg-[#fcfcfc] flex items-center justify-center rounded-xl border border-zinc-100 overflow-hidden flex-shrink-0 ${product.image ? 'cursor-zoom-in' : ''}`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain p-2 transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="text-[9px] text-zinc-300 font-bold">NO_IMAGE_BUFFER</div>
                  )}
                </div>

                {/* 02: CORE CONTENT MATRIX BLOCK LAYOUT */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                  <div className="space-y-1.5">

                    {/* Compact View Screen Viewport Node */}
                    <div className="flex justify-between items-start gap-2 sm:hidden">
                      <div className="min-w-0 flex-1">
                        <span className="text-[8px] font-bold text-zinc-400 block tracking-tight mb-0.5">
                          {product.category || "General Context"}
                        </span>
                        <h3 className="font-sans text-xs font-bold text-zinc-900 normal-case tracking-tight truncate">
                          {product.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold font-mono text-black whitespace-nowrap bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded-md">
                        ₹{product.price}
                      </span>
                    </div>

                    {/* Standard View Screen Viewport Node */}
                    <h3 className="hidden sm:block font-sans text-base font-bold text-zinc-900 normal-case tracking-tight truncate">
                      {product.name}
                    </h3>

                    {/* Multi-Line Dynamic String Description Segment */}
                    <p
                      onClick={() => {
                        if (product.description && product.description.length > 160) {
                          setSelectedDescription({ name: product.name, desc: product.description });
                        }
                      }}
                      className={`font-sans text-zinc-400 text-[11px] sm:text-xs normal-case tracking-normal leading-relaxed pr-2 overflow-hidden text-ellipsis display-webkit-box line-clamp-4 ${product.description && product.description.length > 160 ? 'cursor-pointer hover:text-black transition-colors' : ''
                        }`}
                    >
                      {product.description || "No supplemental validation string schemas provided by host vendor index."}

                      {product.description && product.description.length > 160 && (
                        <span className="text-zinc-500 text-[9px] ml-1 lowercase font-mono font-bold tracking-tight bg-zinc-50 px-1 py-0.5 rounded border border-zinc-100 inline-block">
                          Read Info..
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Compact Add Request Trigger Interface */}
                  <div className="flex sm:hidden justify-end">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="w-full py-2 bg-black text-white font-bold tracking-widest text-[9px] uppercase rounded-lg active:scale-95 transition-transform"
                    >
                      ADD TO CART 🛒
                    </button>
                  </div>
                </div>

                {/* 03: RIGHT SECTION - STANDALONE PRICING COLUMN ARCHITECTURE (DESKTOP) */}
                <div className="hidden sm:flex w-44 flex-col justify-between items-end border-l border-zinc-100 pl-5 my-0.5 flex-shrink-0">
                  <div className="text-right space-y-1.5">
                    <div className="text-[9px] text-zinc-400 font-bold bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100 inline-block tracking-widest">
                      {product.category || "General Context"}
                    </div>
                    <div className="text-lg font-bold font-mono text-black block">
                      ₹{product.price}
                    </div>
                    <span className="text-[8px] text-zinc-400 font-sans normal-case block">Free logistics allocation eligible</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="w-full py-2.5 bg-black text-white text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-zinc-800 transition-colors shadow-sm flex items-center justify-center space-x-1.5"
                  >
                    <span>ADD TO CART</span>
                    <span>🛒</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* REPOSITORY SCHEMATIC EXPANSION OVERLAY CONTAINER */}
      {selectedDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/15 backdrop-blur-md p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setSelectedDescription(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col z-10">

            <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase truncate pr-4">📝 {selectedDescription.name}</h4>
              <button onClick={() => setSelectedDescription(null)} className="text-zinc-400 hover:text-black text-xs font-bold p-1 bg-white border border-zinc-200 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">✕</button>
            </div>

            <div className="p-5 max-h-[50vh] overflow-y-auto bg-white">
              <p className="font-sans text-xs text-zinc-600 normal-case leading-relaxed whitespace-pre-line">{selectedDescription.desc}</p>
            </div>

            <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button onClick={() => setSelectedDescription(null)} className="px-5 py-2 bg-black text-white text-[10px] font-bold tracking-wider rounded-xl hover:bg-zinc-800 transition-colors">
                CLOSE OVERLAY
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW: DYNAMIC FULLSCREEN IMAGE VIEWPORT OVERLAY */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4 transition-all duration-300">
          {/* Click background to close */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedImage(null)}></div>

          <div className="relative max-w-3xl max-h-[80vh] flex flex-col items-center justify-center z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button on top right of screen */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 sm:-right-12 text-white/70 hover:text-white text-xs font-mono font-bold p-2 tracking-widest uppercase transition-colors"
            >
              ✕ CLOSE
            </button>

            {/* Main Fullscreen Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl bg-white/5 shadow-2xl p-2 border border-white/10"
            />

            {/* Product Meta Label at Bottom */}
            <span className="mt-4 px-4 py-1.5 bg-black/80 border border-zinc-800 text-zinc-400 text-[10px] uppercase font-mono tracking-widest rounded-full shadow-md max-w-xs truncate">
              {selectedImage.name}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;