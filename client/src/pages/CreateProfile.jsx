import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import API from '../api';
import CardPDF from '../pdf-templates/CardPDF';
import { Trash2, PlusCircle, Globe, Phone, MessageCircle, Instagram, Linkedin, Facebook, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';

const CreateProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        subtitle: '',
        details: '',
        email: '',
        mobile: '',
        whatsapp: '',
        googleProfile: '',
        googleRating: '',
        locationLink: '',
        website: '',
        appointmentLink: '',
        branchTitle: 'Our Branches',
        branches: [],
        socialMedia: []
    });

    const [profileImage, setProfileImage] = useState(null);
    const [qrLogo, setQrLogo] = useState(null);

    // Shared Tailwind class for highly visible input fields
    const inputStyle = "w-full bg-white border-2 border-slate-200 p-4 rounded-2xl outline-none transition-all duration-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-400 font-medium text-slate-700";

    const socialOptions = [
        { name: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'bg-green-500' },
        { name: 'Facebook', icon: <Facebook size={20} />, color: 'bg-blue-600' },
        { name: 'Instagram', icon: <Instagram size={20} />, color: 'bg-pink-500' },
        { name: 'LinkedIn', icon: <Linkedin size={20} />, color: 'bg-blue-700' },
        { name: 'Website', icon: <Globe size={20} />, color: 'bg-gray-600' },
    ];

    // --- Branch Logic ---
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

    // --- Social Media Logic ---
    const addSocialField = (platform) => {
        if (!formData.socialMedia.find(s => s.platform === platform)) {
            setFormData({ ...formData, socialMedia: [...formData.socialMedia, { platform, url: '' }] });
        }
    };

    const handleSocialChange = (index, value) => {
        const newSocial = [...formData.socialMedia];
        newSocial[index].url = value;
        setFormData({ ...formData, socialMedia: newSocial });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        if (profileImage) data.append('profileImage', profileImage);
        if (qrLogo) data.append('qrLogo', qrLogo);
        
        Object.keys(formData).forEach(key => {
            data.append(key, (key === 'branches' || key === 'socialMedia') ? JSON.stringify(formData[key]) : formData[key]);
        });

        try {
            await API.post('/api/doctors/create', data);
            alert("Profile Created Successfully!");
            navigate('/');
        } catch (err) { 
            console.error(err);
            alert("Error creating profile"); 
        }
    };

    const renderPreview = (file, setter) => (
        <div className="relative w-24 h-24 border-2 border-indigo-500 rounded-2xl overflow-hidden group shadow-lg animate-in zoom-in-95">
            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
            <button type="button" onClick={() => setter(null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md">
                <X size={14} />
            </button>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* LEFT SIDE: FORM */}
            <div className="w-1/2 overflow-y-auto p-12 bg-white relative shadow-2xl border-r border-slate-100">
                <button 
                    onClick={() => navigate('/')} 
                    className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold uppercase text-xs tracking-widest transition-all"
                >
                    <ArrowLeft size={16} /> Dashboard
                </button>

                <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-10">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">New Profile.</h2>
                        <div className="h-2 w-16 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>
                    </div>
                    
                    {/* Image Section */}
                    <div className="flex gap-10 p-6 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Profile Photo</label>
                            {profileImage ? renderPreview(profileImage, setProfileImage) : (
                                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-white transition-all text-slate-300">
                                    <ImageIcon size={24} />
                                    <input type="file" className="hidden" onChange={(e) => setProfileImage(e.target.files[0])} />
                                </label>
                            )}
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">QR Logo</label>
                            {qrLogo ? renderPreview(qrLogo, setQrLogo) : (
                                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-white transition-all text-slate-300">
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
                            <input type="text" placeholder="Dr. John Doe" required className={inputStyle} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Clinic Name</label>
                            <input type="text" placeholder="City Hospital" className={inputStyle} 
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subtitle</label>
                        <input type="text" placeholder="MBBS, MD - Senior Cardiologist" className={inputStyle} 
                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Professional Bio</label>
                        <textarea placeholder="Tell us about your experience..." className={`${inputStyle} h-32 resize-none`}
                            onChange={(e) => setFormData({...formData, details: e.target.value})} />
                    </div>

                    {/* Contacts & Links */}
                    <div className="grid grid-cols-3 gap-4">
                        <input placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputStyle} />
                        <input placeholder="Mobile Number" onChange={(e) => setFormData({...formData, mobile: e.target.value})} className={inputStyle} />
                        <input placeholder="WhatsApp Number" onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-indigo-50/30 p-6 rounded-[32px] border border-indigo-100 shadow-sm">
                        <div className="col-span-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 ml-2">Online Presence</div>
                        <input placeholder="Google Profile URL" onChange={(e) => setFormData({...formData, googleProfile: e.target.value})} className={inputStyle} />
                        <input placeholder="Google Rating (e.g. 4.9)" onChange={(e) => setFormData({...formData, googleRating: e.target.value})} className={inputStyle} />
                        <input placeholder="Official Website URL" onChange={(e) => setFormData({...formData, website: e.target.value})} className={inputStyle} />
                        <input placeholder="Appointment Booking Link" onChange={(e) => setFormData({...formData, appointmentLink: e.target.value})} className={inputStyle} />
                        <div className="col-span-2 mt-2">
                             <input placeholder="Google Map / Location Link" onChange={(e) => setFormData({...formData, locationLink: e.target.value})} className={inputStyle} />
                        </div>
                    </div>

                    {/* Branches Section */}
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
                                
                                <input placeholder="Branch Name*" className={`${inputStyle} border-indigo-50 font-bold text-lg`} 
                                    onChange={(e) => handleBranchChange(index, 'branchName', e.target.value)} />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Branch Email" className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchEmail', e.target.value)} />
                                    <input placeholder="Branch Mobile" className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchMobile', e.target.value)} />
                                    <input placeholder="Branch WhatsApp" className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchWhatsapp', e.target.value)} />
                                    <input placeholder="Consultation Timing" className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchTiming', e.target.value)} />
                                    <input placeholder="Branch Website" className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchWebsite', e.target.value)} />
                                    <input placeholder="Branch Map Link" className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchLocation', e.target.value)} />
                                </div>
                                
                                <input placeholder="Branch Rating Link (Google)" className={inputStyle} onChange={(e) => handleBranchChange(index, 'branchRatingLink', e.target.value)} />
                                <textarea placeholder="Full Branch Address" className={`${inputStyle} h-24 resize-none`} onChange={(e) => handleBranchChange(index, 'branchAddress', e.target.value)} />
                            </div>
                        ))}
                    </div>

                    {/* Social Media */}
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
                                    <input placeholder={`${social.platform} Profile Link`} className="flex-1 text-sm outline-none font-bold text-slate-600"
                                        onChange={(e) => handleSocialChange(index, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full py-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-200 transition-all active:scale-95 uppercase tracking-[0.2em] mt-12">
                        Generate Identity
                    </button>
                </form>
            </div>

            {/* RIGHT SIDE: LIVE PDF PREVIEW */}
            <div className="w-1/2 p-10 flex flex-col items-center justify-center">
                 <div className="w-full h-full rounded-[3.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-white border-[16px] border-slate-900 relative">
                    <div className="bg-slate-900 py-3 text-white text-center font-black text-[10px] uppercase tracking-[0.3em]">Identity Preview Engine</div>
                    <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                        <CardPDF data={formData} />
                    </PDFViewer>
                 </div>
            </div>
        </div>
    );
};

export default CreateProfile;