import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { Phone, MessageCircle, Mail, MapPin, Globe, UserPlus, FileText } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CardPDF from '../pdf-templates/CardPDF';

const DigitalCard = () => {
    const { slug } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/api/doctors/slug/${slug}`)
            .then(res => {
                setDoc(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    // --- Save to Contacts (vCard) Logic ---
    const downloadVCard = () => {
        const vcardData = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${doc.name}`,
            `ORG:${doc.companyName}`,
            `TITLE:${doc.subtitle}`,
            `TEL;TYPE=CELL:${doc.mobile}`,
            `TEL;TYPE=WORK,VOICE:${doc.whatsapp}`,
            `EMAIL:${doc.email}`,
            `URL:${window.location.href}`,
            `ADR;TYPE=WORK:;;${doc.branches[0]?.branchAddress || ""};;;;`,
            "END:VCARD"
        ].join("\n");

        const blob = new Blob([vcardData], { type: "text/vcard" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${doc.name.replace(/\s+/g, '_')}.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!doc) return <div className="text-center mt-20 font-bold">Profile Not Found</div>;

    const profileImg = `http://localhost:5000/uploads/profiles/${doc.profileImage}`;

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg font-sans pb-10">
            {/* Header / Cover Area */}
            <div className="bg-indigo-700 h-32 relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <img src={profileImg} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md" alt={doc.name} />
                </div>
            </div>

            {/* Basic Info */}
            <div className="mt-14 text-center px-4">
                <h1 className="text-2xl font-bold text-gray-800">{doc.name}</h1>
                <p className="text-indigo-600 font-medium">{doc.companyName}</p>
                <p className="text-gray-500 text-sm mt-1">{doc.subtitle}</p>
            </div>

            {/* Action Grid: Primary Actions + Save Contact */}
            <div className="grid grid-cols-4 gap-2 px-6 mt-8">
                <a href={`tel:${doc.mobile}`} className="flex flex-col items-center gap-1">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Phone size={20}/></div>
                    <span className="text-[10px] font-bold">Call</span>
                </a>
                <a href={`https://wa.me/${doc.whatsapp}`} className="flex flex-col items-center gap-1">
                    <div className="bg-green-100 p-3 rounded-full text-green-600"><MessageCircle size={20}/></div>
                    <span className="text-[10px] font-bold">WhatsApp</span>
                </a>
                <a href={doc.locationLink} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600"><MapPin size={20}/></div>
                    <span className="text-[10px] font-bold">Location</span>
                </a>
                {/* Save Contact Button */}
                <button onClick={downloadVCard} className="flex flex-col items-center gap-1">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><UserPlus size={20}/></div>
                    <span className="text-[10px] font-bold">Save</span>
                </button>
            </div>

            {/* About / Details */}
            <div className="px-6 mt-8">
                <h3 className="font-bold border-l-4 border-indigo-600 pl-2 mb-3">About</h3>
                <div className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: doc.details }} />
            </div>

            {/* Branch Section */}
            {doc.branches?.length > 0 && (
                <div className="px-6 mt-8">
                    <h3 className="font-bold border-l-4 border-indigo-600 pl-2 mb-4">{doc.branchTitle}</h3>
                    {doc.branches.map((branch, i) => (
                        <div key={i} className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-gray-800">{branch.branchName}</h4>
                            <p className="text-xs text-gray-500 mb-3">{branch.branchAddress}</p>
                            <div className="flex gap-4">
                                <a href={`tel:${branch.branchMobile}`} className="text-blue-600 flex items-center gap-1 text-xs font-bold">
                                    <Phone size={14}/> Call
                                </a>
                                <a href={`https://wa.me/${branch.branchWhatsapp}`} className="text-green-600 flex items-center gap-1 text-xs font-bold">
                                    <MessageCircle size={14}/> WhatsApp
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PDF DOWNLOAD SECTION: Placed at the bottom for easy access */}
            <div className="mt-10 px-6">
                <PDFDownloadLink 
                    document={<CardPDF data={doc} />} 
                    fileName={`${doc.slug}-card.pdf`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white text-center py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors"
                >
                    {({ loading }) => (
                        loading ? 'Preparing PDF...' : <><FileText size={18} /> Download PDF Card</>
                    )}
                </PDFDownloadLink>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mt-10">
                {doc.socialMedia?.map((social, i) => (
                    <a key={i} href={social.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600">
                        <Globe size={24} />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default DigitalCard;