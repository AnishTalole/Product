import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import API from '../api';
import CardPDF from '../pdf-templates/CardPDF';
import { Trash2, PlusCircle, Globe, MessageCircle, Instagram, Linkedin, Facebook, Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

const EditProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [qrLogo, setQrLogo] = useState(null);

    // Shared styling for all inputs: Indigo border + Glowing shadow on focus
    const inputStyle = "w-full bg-white border-2 border-slate-200 p-4 rounded-2xl outline-none transition-all duration-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-400 font-medium text-slate-700";

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await API.get(`/api/doctors/${id}`);
                setFormData(res.data);
            } catch (err) {
                console.error("Error fetching doctor:", err);
                alert("Could not load doctor data.");
            }
        };
        fetchDoctor();
    }, [id]);

    const socialOptions = [
        { name: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'bg-green-500' },
        { name: 'Facebook', icon: <Facebook size={20} />, color: 'bg-blue-600' },
        { name: 'Instagram', icon: <Instagram size={20} />, color: 'bg-pink-500' },
        { name: 'LinkedIn', icon: <Linkedin size={20} />, color: 'bg-blue-700' },
        { name: 'Website', icon: <Globe size={20} />, color: 'bg-gray-600' },
    ];

    // --- Dynamic Logic ---
    const addBranch = () => {
        setFormData({
            ...formData,
            branches: [...formData.branches, { 
                branchName: '', branchEmail: '', branchMobile: '', branchWhatsapp: '', 
                branchGoogleProfile: '', branchRatingLink: '', branchLocation: '', 
                branchTiming: '', branchWebsite: '', branchAddress: '' 
            }]
        });
    };

    const handleBranchChange = (index, field, value) => {
        const newBranches = [...formData.branches];
        newBranches[index][field] = value;
        setFormData({ ...formData, branches: newBranches });
    };

    const removeBranch = (index) => {
        const newBranches = formData.branches.filter((_, i) => i !== index);
        setFormData({ ...formData, branches: newBranches });
    };

    const addSocialField = (platform) => {
        if (!formData.socialMedia.find(s => s.platform === platform)) {
            setFormData({
                ...formData,
                socialMedia: [...formData.socialMedia, { platform, url: '' }]
            });
        }
    };

    const handleSocialChange = (index, value) => {
        const newSocial = [...formData.socialMedia];
        newSocial[index].url = value;
        setFormData({ ...formData, socialMedia: newSocial });
    };

    const removeSocial = (index) => {
        const newSocial = formData.socialMedia.filter((_, i) => i !== index);
        setFormData({ ...formData, socialMedia: newSocial });
    };

    // --- File Deletion From Server ---
    const handleServerDelete = async (fieldName, filename, folder) => {
        if (window.confirm("Permanently delete this image from the server?")) {
            try {
                await API.post('/api/doctors/delete-file', { filePath: `public/uploads/${folder}/${filename}` });
                setFormData({ ...formData, [fieldName]: null });
                alert("File removed from server.");
            } catch (err) { 
                console.error(err);
                alert("Delete failed"); 
            }
        }
    };

    const renderLocalPreview = (file, setter) => (
        <div className="relative w-24 h-24 border-2 border-indigo-500 rounded-xl overflow-hidden group shadow-lg animate-in zoom-in-95">
            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
            <button type="button" onClick={() => setter(null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <X size={14} />
            </button>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        if (profileImage) data.append('profileImage', profileImage);
        if (qrLogo) data.append('qrLogo', qrLogo);
        
        Object.keys(formData).forEach(key => {
            if (key === 'branches' || key === 'socialMedia') {
                data.append(key, JSON.stringify(formData[key]));
            } else if (key !== 'profileImage' && key !== 'qrLogo' && key !== 'qrCodePath') {
                data.append(key, formData[key]);
            }
        });

        try {
            await API.put(`/api/doctors/${id}`, data);
            alert("Profile Updated Successfully!");
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    if (!formData) return <div className="h-screen flex items-center justify-center font-bold text-slate-500 text-xl tracking-widest italic">Loading Doctor Data...</div>;

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* LEFT SIDE: EDIT FORM */}
            <div className="w-1/2 overflow-y-auto p-12 bg-white relative shadow-2xl border-r border-slate-100">
                <button 
                    onClick={() => navigate('/')}
                    className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold uppercase text-xs tracking-widest transition-all"
                >
                    <ArrowLeft size={16} /> Dashboard
                </button>

                <form onSubmit={handleSubmit} className="space-y-10 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Edit Identity.</h2>
                        <div className="h-1.5 w-16 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>
                    </div>
                    
                    {/* Image Section */}
                    <div className="grid grid-cols-2 gap-8 p-6 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
                        {/* Profile Photo */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Profile Photo</label>
                            {formData.profileImage ? (
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
                                    <img src={`https://my-product-app-backend-opfu.onrender.com/uploads/profiles/${formData.profileImage}`} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => handleServerDelete('profileImage', formData.profileImage, 'profiles')} className="absolute inset-0 bg-red-600/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px]">
                                        <Trash2 size={20} /> DELETE
                                    </button>
                                </div>
                            ) : profileImage ? (
                                renderLocalPreview(profileImage, setProfileImage)
                            ) : (
                                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-white text-slate-400 transition-all">
                                    <ImageIcon size={24} />
                                    <input type="file" className="hidden" onChange={(e) => setProfileImage(e.target.files[0])} />
                                </label>
                            )}
                        </div>

                        {/* QR Logo */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">QR Center Logo</label>
                            {formData.qrLogo ? (
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white group">
                                    <img src={`https://my-product-app-backend-opfu.onrender.com/uploads/logos/${formData.qrLogo}`} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => handleServerDelete('qrLogo', formData.qrLogo, 'logos')} className="absolute inset-0 bg-red-600/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px]">
                                        <Trash2 size={20} /> DELETE
                                    </button>
                                </div>
                            ) : qrLogo ? (
                                renderLocalPreview(qrLogo, setQrLogo)
                            ) : (
                                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-white text-slate-400 transition-all">
                                    <PlusCircle size={24} />
                                    <input type="file" className="hidden" onChange={(e) => setQrLogo(e.target.files[0])} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name*</label>
                            <input type="text" value={formData.name} required className={inputStyle} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Clinic Name</label>
                            <input type="text" value={formData.companyName} className={inputStyle} 
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subtitle</label>
                        <input type="text" value={formData.subtitle} className={inputStyle} 
                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Professional Bio</label>
                        <textarea value={formData.details} className={`${inputStyle} h-32 resize-none`}
                            onChange={(e) => setFormData({...formData, details: e.target.value})} />
                    </div>

                    {/* Contacts & Links */}
                    <div className="grid grid-cols-3 gap-4">
                        <input placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputStyle} />
                        <input placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className={inputStyle} />
                        <input placeholder="WhatsApp Number" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className={inputStyle} />
                    </div>

                    {/* Online Presence Section */}
                    <div className="grid grid-cols-2 gap-4 bg-indigo-50/30 p-6 rounded-[32px] border border-indigo-100 shadow-sm">
                        <div className="col-span-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 ml-2">Online Presence</div>
                        <input placeholder="Google Profile URL" value={formData.googleProfile} onChange={(e) => setFormData({...formData, googleProfile: e.target.value})} className={inputStyle} />
                        <input placeholder="Google Rating" value={formData.googleRating} onChange={(e) => setFormData({...formData, googleRating: e.target.value})} className={inputStyle} />
                        <input placeholder="Official Website Link" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className={inputStyle} />
                        <input placeholder="Appointment Booking Link" value={formData.appointmentLink} onChange={(e) => setFormData({...formData, appointmentLink: e.target.value})} className={inputStyle} />
                        <div className="col-span-2 mt-2">
                             <input placeholder="Google Map / Location Link" value={formData.locationLink} onChange={(e) => setFormData({...formData, locationLink: e.target.value})} className={inputStyle} />
                        </div>
                    </div>

                    {/* Branches */}
                    <div className="space-y-6 pt-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-black text-xl text-slate-800 tracking-tight italic underline decoration-indigo-500 decoration-4 underline-offset-8">Branches</h3>
                            <button type="button" onClick={addBranch} className="text-indigo-600 flex items-center gap-2 text-sm font-black bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all shadow-sm">
                                <PlusCircle size={18} /> Add New Branch
                            </button>
                        </div>
                        {formData.branches.map((branch, index) => (
                            <div key={index} className="border-2 border-slate-100 p-8 rounded-[2.5rem] bg-white relative group shadow-lg hover:border-indigo-200 transition-all space-y-4">
                                <button type="button" onClick={() => removeBranch(index)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:scale-110 transition-all">
                                    <Trash2 size={20} />
                                </button>
                                <input placeholder="Branch Name*" value={branch.branchName} className={`${inputStyle} border-indigo-50 font-bold text-lg`} 
                                    onChange={(e) => handleBranchChange(index, 'branchName', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Branch Email" value={branch.branchEmail} className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchEmail', e.target.value)} />
                                    <input placeholder="Branch Mobile" value={branch.branchMobile} className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchMobile', e.target.value)} />
                                    <input placeholder="Branch WhatsApp" value={branch.branchWhatsapp} className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchWhatsapp', e.target.value)} />
                                    <input placeholder="Branch Timing" value={branch.branchTiming} className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchTiming', e.target.value)} />
                                    <input placeholder="Branch Website" value={branch.branchWebsite} className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchWebsite', e.target.value)} />
                                    <input placeholder="Branch Map Link" value={branch.branchLocation} className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchLocation', e.target.value)} />
                                </div>
                                <input placeholder="Branch Google Rating Link" value={branch.branchRatingLink} className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchRatingLink', e.target.value)} />
                                <textarea placeholder="Full Branch Address" value={branch.branchAddress} className={`${inputStyle} h-24 resize-none`} onChange={(e) => handleBranchChange(index, 'branchAddress', e.target.value)} />
                            </div>
                        ))}
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-6 pt-4">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight italic text-center underline decoration-indigo-500 decoration-4 underline-offset-8">Social Connect</h3>
                        <div className="flex gap-4 flex-wrap justify-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                            {socialOptions.map(option => (
                                <button key={option.name} type="button" onClick={() => addSocialField(option.name)}
                                    className={`${option.color} text-white p-4 rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95`}>
                                    {option.icon}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {formData.socialMedia.map((social, index) => (
                                <div key={index} className="flex items-center gap-4 bg-white border-2 border-slate-100 p-4 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
                                    <span className="w-24 text-[10px] font-black text-slate-400 uppercase tracking-widest">{social.platform}</span>
                                    <input placeholder={`${social.platform} Profile Link`} value={social.url} className="flex-1 text-sm outline-none font-bold text-slate-600"
                                        onChange={(e) => handleSocialChange(index, e.target.value)} />
                                    <button type="button" onClick={() => removeSocial(index)} className="text-slate-300 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full py-6 bg-slate-900 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-200 transition-all active:scale-95 uppercase tracking-[0.2em] mt-12 flex items-center justify-center gap-3">
                        <Save size={24} /> Update Identity
                    </button>
                </form>
            </div>

            {/* RIGHT SIDE: LIVE PREVIEW */}
            <div className="w-1/2 p-10 flex flex-col items-center justify-center">
                <div className="w-full h-full rounded-[3.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-white border-[16px] border-slate-900 relative">
                    <div className="bg-slate-900 p-3 text-white text-center font-black text-[10px] uppercase tracking-[0.3em]">Identity Preview Engine</div>
                    <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                        <CardPDF data={formData} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;