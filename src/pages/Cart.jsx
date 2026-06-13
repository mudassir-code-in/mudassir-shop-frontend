import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [cartData, setCartData] = useState(null);

  // Modal & Address Sub-System Controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedAddressesList, setSavedAddressesList] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  // Address Entity Structural Schema Data Form
  const [addressForm, setAddressForm] = useState({
    fullname: '',
    phonenumber: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  // READ: Fetch current active cart instances from server cluster
  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const response = await axios.get(`${API_URL}/api/product/get-cart`, {
        withCredentials: true
      });

      if (response.data && response.data.userCart) {
        setCartData(response.data.userCart);
      } else {
        setCartData({ products: [] });
      }
    } catch (error) {
      if (error.response?.status === 404 && error.response?.data?.message === 'Empty') {
        setCartData({ products: [] });
      } else if (error.response?.status === 401) {
        setErrorMsg("Authentication credentials rejected. Please re-verify system session status.");
      } else {
        setErrorMsg(error.response?.data?.message || "Failed to parse active database repository instance.");
      }
    } finally {
      setLoading(false);
    }
  };

  // READ: Query saved delivery location address metadata stack
  const fetchSavedAddress = async () => {
    try {
      setAddressLoading(true);
      const response = await axios.get(`${API_URL}/api/order/get-my-address`, {
        withCredentials: true
      });

      if (!response.data || !response.data.success) {
        setSavedAddressesList([]);
        return;
      }

      const addressData = response.data.userAddress;
      let rawAddressesArray = [];

      // Flatten multi-dimensional array indices to unified structural schemas
      if (Array.isArray(addressData) && addressData.length > 0) {
        if (Array.isArray(addressData[0])) {
          rawAddressesArray = addressData[0];
        } else {
          rawAddressesArray = addressData;
        }
      }

      if (rawAddressesArray && rawAddressesArray.length > 0) {
        const formattedAddresses = rawAddressesArray.map((item) => ({
          _id: item._id,
          fullname: item.fullname || '',
          phonenumber: item.phonenumber || '',
          street: item.street || '',
          landmark: item.landmark || '',
          city: item.city || '',
          state: item.state || '',
          pincode: item.pincode || ''
        }));

        setSavedAddressesList(formattedAddresses);
      } else {
        setSavedAddressesList([]);
      }
    } catch (error) {
      setSavedAddressesList([]);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
    fetchSavedAddress();
  }, []);

  // MUTATE: Increment item quantity block unit within system allocation mapping
  const handleAddToCart = async (productId) => {
    try {
      await axios.post(`${API_URL}/api/product/add-cart`,
        { productId },
        { withCredentials: true }
      );
      fetchCartProducts();
    } catch (error) {
      setErrorMsg("Failed to synchronize quantity addition adjustments inside ledger context.");
    }
  };

  // MUTATE: Sever entity relation connection index context entirely out of active bag
  const handleRemoveFromCart = async (productId) => {
    try {
      setErrorMsg('');
      await axios.post(`${API_URL}/api/product/remove-cart-product`,
        { productId },
        { withCredentials: true }
      );
      fetchCartProducts();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Server rejected data row deletion command execution signal.");
    }
  };

  // Control manual keystroke stream mappings into target memory buffers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ACTION: Execute transactional data bundle shipment protocol arrays
  const deployOrderPipeline = async (addressPayload) => {
    try {
      setErrorMsg('');
      setLoading(true);

      const response = await axios.post(`${API_URL}/api/order/order-product`,
        addressPayload,
        { withCredentials: true }
      );

      setAddressForm({ fullname: '', phonenumber: '', street: '', landmark: '', city: '', state: '', pincode: '' });
      setIsModalOpen(false);
      fetchCartProducts();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Order operational pipeline pipeline initialization error.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    deployOrderPipeline(addressForm);
  };

  const handleUseSavedAddressSubmit = (selectedAddress) => {
    if (!selectedAddress) return;

    const payload = {
      fullname: selectedAddress.fullname,
      phonenumber: selectedAddress.phonenumber,
      street: selectedAddress.street,
      landmark: selectedAddress.landmark,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode
    };

    deployOrderPipeline(payload);
  };

  // COMPUTE: Deduce system operational metric mathematical values
  const productsList = cartData?.products || [];

  const totalAmount = productsList.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    const quantity = item.quantity || 1;
    return acc + (price * quantity);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 font-mono text-xs uppercase flex items-center justify-center text-zinc-400">
        🔄 Processing system ledger framework...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-mono text-xs uppercase tracking-wider text-zinc-800 p-4 sm:p-10 pt-24">
      <div className="max-w-5xl mx-auto">

        {/* SYSTEM STATUS NOTIFICATION DISPLAY FRAME */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <h1 className="text-xl font-light text-black mb-8 tracking-widest">🛒 YOUR SHOPPING SECTOR</h1>

        {productsList.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
            <span className="text-3xl mb-3">🛍️</span>
            <p className="text-zinc-400 font-sans normal-case text-sm">Your shopping container asset pool is currently empty.</p>
            <a href="/" className="mt-4 bg-black text-white px-6 py-2.5 font-bold tracking-widest hover:bg-zinc-800 transition-colors">
              CONTINUE SHOPPING
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* PRODUCT METADATA LEDGER COLUMN ARCHITECTURE */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm p-6 space-y-4">
              {productsList.map((item, index) => {
                const productData = item.productId || {};
                return (
                  <div key={item._id || index} className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-none last:pb-0">
                    <div className="flex items-center gap-4">
                      {productData.image ? (
                        <img src={productData.image} alt={productData.name} className="w-16 h-16 object-cover border border-zinc-200 p-1 bg-zinc-50" />
                      ) : (
                        <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[9px] text-zinc-400">NO IMG</div>
                      )}

                      <div>
                        <h3 className="font-sans text-sm font-medium text-black normal-case tracking-normal">{productData.name || "Unnamed Product"}</h3>
                        <p className="text-zinc-400 mt-1 font-mono">₹{productData.price || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-zinc-200 rounded bg-zinc-50 overflow-hidden">
                        <span className="px-3 py-1 text-zinc-500 font-mono text-sm">QTY: {item.quantity || 1}</span>
                        <button onClick={() => handleAddToCart(productData._id)} className="bg-zinc-200 hover:bg-zinc-300 px-2.5 py-1 text-black font-bold border-l border-zinc-200">+</button>
                      </div>

                      <button onClick={() => handleRemoveFromCart(productData._id)} className="text-red-500 hover:text-red-700 font-sans normal-case text-xs tracking-normal font-medium">
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* METRIC PRICE SUMMATION CONSOLE BOX VIEW */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xs font-bold text-black uppercase tracking-widest border-b border-zinc-200 pb-3 mb-4">PRICE BREAKDOWN</h2>

              <div className="space-y-3 font-sans text-sm text-zinc-600 normal-case">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-mono text-black font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>System Delivery Charges</span>
                  <span className="font-mono text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-zinc-200 my-4"></div>
                <div className="flex justify-between text-black font-semibold text-base font-mono uppercase tracking-wider">
                  <span>ESTIMATED TOTAL</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-black text-white p-3.5 font-bold mt-6 hover:bg-zinc-900 transition-colors uppercase tracking-widest text-xs rounded shadow-sm"
              >
                PROCEED TO CHECKOUT 🚀
              </button>
            </div>

          </div>
        )}

        {/* SHIPMENT ALLOCATION CONFIGURATION INTERFACE (MODAL LAYER) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/15 backdrop-blur-md p-4 transition-all duration-300">
            <div className="absolute inset-0 bg-transparent" onClick={() => setIsModalOpen(false)}></div>

            <div className="relative bg-white w-full max-w-lg rounded-2xl border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[90vh] z-10">

              <div className="p-5 border-b border-zinc-100 bg-zinc-50/90 flex justify-between items-center">
                <h2 className="text-xs font-bold tracking-widest text-black uppercase">🗺️ LOGISTICS SHIPPING VECTOR</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black font-sans text-lg font-bold p-1">✕</button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">

                {/* PERSISTED STACK DIRECTORY MAP LOOP SUB-ROUTINE */}
                {savedAddressesList.length > 0 && (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4 shadow-inner">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block">
                      ✓ Saved Addresses Detected ({savedAddressesList.length})
                    </span>

                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                      {savedAddressesList.map((addr, idx) => (
                        <div key={addr._id || idx} className="font-sans text-xs text-zinc-600 normal-case space-y-2 bg-white p-3 rounded-lg border border-zinc-100 shadow-sm hover:border-zinc-400 transition-all">
                          <div>
                            <p className="font-mono text-black font-bold uppercase">{addr.fullname || 'No Name'}</p>
                            {addr.phonenumber && <p className="font-mono text-[11px] text-zinc-700">📱 {addr.phonenumber}</p>}
                            <p className="mt-1 font-medium">{addr.street} {addr.landmark ? `, ${addr.landmark}` : ''}</p>
                            <p className="uppercase font-mono text-[11px] text-zinc-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUseSavedAddressSubmit(addr)}
                            className="w-full bg-zinc-100 text-zinc-900 border border-zinc-300 font-mono font-bold tracking-widest py-2 text-[10px] rounded hover:bg-black hover:text-white transition-all flex items-center justify-center gap-1"
                          >
                            SHIP TO THIS ADDRESS 🚚
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-zinc-200"></div>
                      <span className="flex-shrink mx-3 text-[9px] text-zinc-400 font-mono font-bold">OR USE A NEW ADDRESS BELOW</span>
                      <div className="flex-grow border-t border-zinc-200"></div>
                    </div>
                  </div>
                )}

                {/* STRUCTURAL SCHEMATIC MANUAL INGESTION FORM CONTAINER */}
                <form onSubmit={handlePlaceOrderSubmit} className="space-y-4 font-sans text-xs normal-case tracking-normal">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-bold mb-1 text-zinc-500">Full Name *</label>
                    <input type="text" name="fullname" required value={addressForm.fullname} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-lg p-2.5 font-mono text-xs uppercase bg-zinc-50 focus:outline-none focus:border-black" placeholder="John Doe" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold mb-1 text-zinc-500">Phone Number *</label>
                      <input type="tel" name="phonenumber" required value={addressForm.phonenumber} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-lg p-2.5 font-mono text-xs bg-zinc-50 focus:outline-none focus:border-black" placeholder="9876543210" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold mb-1 text-zinc-500">Pincode *</label>
                      <input type="text" name="pincode" required value={addressForm.pincode} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-lg p-2.5 font-mono text-xs bg-zinc-50 focus:outline-none focus:border-black" placeholder="110001" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-bold mb-1 text-zinc-500">Street Address / House No *</label>
                    <input type="text" name="street" required value={addressForm.street} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-lg p-2.5 bg-zinc-50 focus:outline-none focus:border-black" placeholder="Flat 402, Building A" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider font-bold mb-1 text-zinc-500">Landmark *</label>
                    <input type="text" name="landmark" required value={addressForm.landmark} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-lg p-2.5 bg-zinc-50 focus:outline-none focus:border-black" placeholder="Near Cyber Hub" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold mb-1 text-zinc-500">City *</label>
                      <input type="text" name="city" required value={addressForm.city} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-lg p-2.5 font-mono text-xs uppercase bg-zinc-50 focus:outline-none focus:border-black" placeholder="Gurugram" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold mb-1 text-zinc-500">State *</label>
                      <input type="text" name="state" required value={addressForm.state} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-lg p-2.5 font-mono text-xs uppercase bg-zinc-50 focus:outline-none focus:border-black" placeholder="Haryana" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex gap-3 justify-end font-mono text-xs uppercase tracking-wider">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 border border-zinc-200 text-zinc-500 hover:text-black font-bold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-black text-white hover:bg-zinc-800 font-bold rounded-lg transition-colors shadow-md"
                    >
                      SAVE & DEPLOY NEW ORDER 🚀
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;