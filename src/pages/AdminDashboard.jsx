import React, { useState, useEffect } from 'react';
import axios from 'axios'; 



const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State Handlers
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');

  // Asset Binary States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // READ: Query Database Records
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const response = await axios.get('https://mudassir-shop-backned.onrender.com/api/product/get-all-products', {
        withCredentials: true
      });

      if (response.data && response.data.allProducts) {
        setProducts(response.data.allProducts);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setProducts([]);
      } else {
        setErrorMsg(error.response?.data?.message || "Failed to establish a stable database connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync and process local file previews
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // MUTATE: Execute Insertion (POST) or Modification (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isEditing && (!formName || !formPrice || !formDescription || !formCategory)) {
      setErrorMsg("All product fields are required before uploading.");
      return;
    }

    try {
      setSubmitting(true);

      if (isEditing) {
        // UPDATE INTERFACE CONTEXT
        const updatePayload = {
          productId: currentId,
          name: formName || undefined,
          price: formPrice ? Number(formPrice) : undefined,
          description: formDescription || undefined,
          category: formCategory || undefined
        };

        Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);

        const response = await axios.post(
          'https://mudassir-shop-backned.onrender.com/api/product/update-product',
          updatePayload,
          { withCredentials: true }
        );

        setSuccessMsg(response.data.message || "Product entry modified successfully.");
        setIsEditing(false);
        setCurrentId(null);
      } else {
        // CREATE INTERFACE CONTEXT
        const formData = new FormData();
        formData.append('name', formName);
        formData.append('price', Number(formPrice));
        formData.append('description', formDescription);
        formData.append('category', formCategory);

        if (selectedImage) {
          formData.append('image', selectedImage);
        }

        const response = await axios.post(
          'https://mudassir-shop-backned.onrender.com/api/product/upload-product',
          formData,
          {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        setSuccessMsg(response.data.message || "New product added successfully.");
      }

      // Clear form inputs
      setFormName('');
      setFormPrice('');
      setFormDescription('');
      setFormCategory('');
      setSelectedImage(null);
      setImagePreview('');

      await fetchProducts();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Server rejected the operation request.");
    } finally {
      setSubmitting(false);
    }
  };

  // REMOVE: Drop targeted index entity
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        setSubmitting(true);

        const response = await axios.delete(`https://mudassir-shop-backned.onrender.com/api/product/delete/${id}`, {
          withCredentials: true
        });

        setSuccessMsg(response.data.message || "Product removed successfully.");
        await fetchProducts();
      } catch (error) {
        setErrorMsg(error.response?.data?.message || "Failed to execute delete procedure.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentId(product._id);
    setFormName(product.name);
    setFormPrice(product.price);
    setFormDescription(product.description);
    setFormCategory(product.category);
    setImagePreview(product.image || '');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-mono text-xs text-zinc-800 relative">

      {/* LOADING OVERLAY SCREEN */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/20 backdrop-blur-md transition-all duration-300">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xl flex flex-col items-center space-y-4 max-w-xs w-full text-center">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin"></div>
            <div className="space-y-1">
              <p className="font-bold tracking-widest text-black text-[10px]">UPDATING ENGINE...</p>
              <p className="text-zinc-400 text-[9px] font-sans">Processing your inventory adjustment updates.</p>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION CONTROLS PANEL */}
      <div className="w-64 bg-white border-r border-zinc-200 p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="pb-4 border-b border-zinc-100">
            <span className="text-[10px] text-zinc-400 block font-bold tracking-widest uppercase">Management Hub</span>
            <h1 className="text-lg font-bold text-black tracking-wider mt-1">VNTG CONSOLE</h1>
          </div>
          {/* 🎯 FIX: Removed the navigation redirect/catalog link item completely from here */}
          <div className="mt-8 space-y-2 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
            <p className="text-black bg-zinc-50 border border-zinc-200 p-3 rounded-xl flex items-center gap-2">
              <span>🖥️</span> System Active
            </p>
          </div>
        </div>
        <div className="text-[9px] text-zinc-400 tracking-wide leading-relaxed font-sans border-t border-zinc-100 pt-4">
          Logged in as Root Administrative Session Agent.
        </div>
      </div>

      {/* CORE FRAMEWORK WORKSPACE */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full overflow-hidden">

        {/* TOP STATUS CONTROL HEADER */}
        <div className="mb-6 border-b border-zinc-100 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-black tracking-tight">System Inventory</h2>
            <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">Live Inventory Administration Console</p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Database: Online
          </span>
        </div>

        {/* FEEDBACK RESPONSES AREA */}
        {errorMsg && <div className="bg-red-50 text-red-600 border border-red-200 p-4 text-xs rounded-xl font-bold mb-4">⚠️ Error: {errorMsg}</div>}
        {successMsg && <div className="bg-zinc-900 text-white border border-zinc-800 p-4 text-xs rounded-xl font-bold tracking-wide mb-4 shadow-sm">{successMsg}</div>}

        {/* INVENTORY TRACKING METRICS BLOCK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 border border-zinc-200 rounded-2xl shadow-sm">
            <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Live Products Loaded</span>
            <div className="text-2xl font-bold text-black mt-1">{loading ? "Synchronizing..." : `${products.length} Items`}</div>
            <div className="w-full bg-zinc-100 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-black h-full transition-all duration-500" style={{ width: `${Math.min((products.length / 20) * 100, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-5 border border-zinc-200 rounded-2xl shadow-sm">
            <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Operational Metrics</span>
            <div className="text-2xl font-bold text-black mt-1">{loading ? "Synchronizing..." : `${products.length} Active`}</div>
            <div className="w-full bg-zinc-100 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full"></div>
            </div>
          </div>
        </div>

        {/* SPLIT CONTROL COMPONENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* DOCK DATA FORM CONTAINER */}
          <div className="bg-white p-5 sm:p-6 border border-zinc-200 rounded-2xl shadow-sm h-fit">
            <h3 className="text-xs font-bold text-black border-b border-zinc-100 pb-3 mb-4 uppercase tracking-widest">
              {isEditing ? "⚙️ Modify Data Document" : "➕ Deploy Data Row"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* IMAGE LOADER STREAM */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Product Banner Image</label>
                <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-zinc-200 bg-white"
                    />
                  ) : (
                    <div className="w-12 h-12 border border-dashed border-zinc-300 rounded-lg flex items-center justify-center text-[9px] text-zinc-400 bg-white font-sans text-center px-1">
                      No Image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-[11px] text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-mono file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
                  />
                </div>
              </div>

              {/* PRODUCT NAME */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vintage Leather Jacket"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-3 bg-zinc-50/50 border border-zinc-200 text-xs font-sans rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-black font-medium normal-case"
                  required
                />
              </div>

              {/* PRODUCT PRICE */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Product Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 199"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full p-3 bg-zinc-50/50 border border-zinc-200 text-xs font-sans rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-black font-medium"
                  required
                />
              </div>

              {/* ITEM DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Item Description</label>
                <textarea
                  placeholder="Enter technical specifications or description overview..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 bg-zinc-50/50 border border-zinc-200 text-xs font-sans rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-black font-medium resize-none h-20 normal-case"
                  required
                />
              </div>

              {/* CATEGORY SECTOR */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Category Sector</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-3 bg-zinc-50/50 border border-zinc-200 text-xs rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-black font-bold appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* FORM ACTION CONTROLS */}
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 text-white p-3.5 text-xs font-bold rounded-xl transition-all active:scale-[0.99] ${submitting ? 'bg-zinc-400 cursor-not-allowed' : isEditing ? 'bg-zinc-700 hover:bg-zinc-900' : 'bg-black hover:bg-zinc-800'
                    }`}
                >
                  {isEditing ? "Save Product Changes" : "Deploy Product"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setIsEditing(false);
                      setFormName(''); setFormPrice(''); setFormDescription(''); setFormCategory(''); setSelectedImage(null); setImagePreview('');
                    }}
                    className="bg-zinc-100 border border-zinc-200 text-zinc-600 px-4 rounded-xl hover:bg-zinc-200 disabled:opacity-50 font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ACTIVE LOG DISPLAY GRID TABLE */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <span className="font-bold text-black uppercase tracking-widest text-[10px]">Master Inventory Ledger</span>
              <span className="text-[10px] bg-zinc-200 text-zinc-700 px-2.5 py-0.5 font-bold rounded-full">
                {loading ? "..." : `${products.length} Records`}
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Visual</th>
                    <th className="p-4">Item Identity</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Description Brief</th>
                    <th className="p-4">Valuation</th>
                    <th className="p-4 text-right">Actions Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-sans text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center font-mono text-xs text-zinc-400 bg-white">
                        🔄 Fetching live database sync records status...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center font-mono text-xs text-zinc-400 bg-white">
                        📭 Inventory spreadsheet is clear. Setup complete for new uploads.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="p-4">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-9 h-9 object-cover rounded-lg border border-zinc-100 bg-white shadow-xs" />
                          ) : (
                            <div className="w-9 h-9 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-center text-[8px] font-mono text-zinc-400">N/A</div>
                          )}
                        </td>
                        <td className="p-4 font-bold text-black truncate max-w-[120px]">{product.name}</td>
                        <td className="p-4 font-mono text-zinc-500 text-[11px]">{product.category}</td>
                        <td className="p-4 text-zinc-400 max-w-[150px] truncate normal-case font-medium">{product.description}</td>
                        <td className="p-4 font-mono font-bold text-zinc-900 text-[13px]">${product.price}</td>
                        <td className="p-4 text-right font-mono text-xs space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-zinc-500 hover:text-black hover:underline font-bold"
                          >
                            [Edit]
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            [Del]
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;