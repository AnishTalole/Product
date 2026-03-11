import React, { useEffect, useState } from 'react';
import API from '../api';
import { Edit, Trash2, Download, ExternalLink, Plus, Copy, Check, LogOut, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search State
    const [copiedId, setCopiedId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await API.get('/api/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error("Failed to fetch doctors", err);
        }
    };

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const deleteDoctor = async (id) => {
        if (window.confirm("Are you sure you want to delete this profile?")) {
            try {
                await API.delete(`/api/doctors/${id}`);
                fetchDoctors();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filter Logic for Search Bar (Filters by Name or Clinic)
    const filteredDoctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-10 bg-[#f8fafc] min-h-screen font-sans">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Doctor Management</h1>
                    <p className="text-slate-500 mt-2">Manage your digital visiting cards and QR codes</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all font-bold">
                        <Plus size={20} /> New Profile
                    </Link>
                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="bg-white border-2 border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-100 px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-sm"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Search Bar Section */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search size={20} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by doctor name or clinic..." 
                    className="w-full bg-white border-2 border-slate-200 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Doctor & Clinic</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Profile URL</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-center">QR Code</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredDoctors.map((doc) => {
                            const profileUrl = `${window.location.origin}/card/${doc.slug}`;
                            return (
                                <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                                                <img 
                                                    src={`https://my-product-app-backend-opfu.onrender.com/uploads/profiles/${doc.profileImage}`} 
                                                    alt={doc.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-base">{doc.name}</div>
                                                <div className="text-sm text-slate-500">{doc.companyName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 group">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 max-w-[200px] truncate">
                                                {profileUrl}
                                            </span>
                                            <button 
                                                onClick={() => copyToClipboard(profileUrl, doc._id)}
                                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                                            >
                                                {copiedId === doc._id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex justify-center">
                                            <a 
                                                href={`https://my-product-app-backend-opfu.onrender.com/uploads/qrcodes/${doc.qrCodePath}`} 
                                                download={`${doc.name.replace(/\s+/g, '_')}_QR.png`}
                                                className="relative group block cursor-pointer"
                                                title="Click to download QR"
                                            >
                                                <img 
                                                    src={`https://my-product-app-backend-opfu.onrender.com/uploads/qrcodes/${doc.qrCodePath}`} 
                                                    alt="QR" 
                                                    className="w-14 h-14 rounded-lg border border-slate-200 group-hover:opacity-50 transition-all"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Download size={18} className="text-indigo-600" />
                                                </div>
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link 
                                                to={`/card/${doc.slug}`} 
                                                target="_blank" 
                                                className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                title="View Live Card"
                                            >
                                                <ExternalLink size={20} />
                                            </Link>
                                            <Link 
                                                to={`/edit/${doc._id}`} 
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                <Edit size={20} />
                                            </Link>
                                            <button 
                                                onClick={() => deleteDoctor(doc._id)} 
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                                                title="Delete Profile"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredDoctors.length === 0 && (
                    <div className="text-center py-20 text-slate-400 italic font-medium">
                        {searchTerm ? `No results matching "${searchTerm}"` : 'No profiles found.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;