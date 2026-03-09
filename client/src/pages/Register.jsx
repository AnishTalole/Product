import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-slate-900">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-96 space-y-6 border-t-8 border-indigo-600">
                <h2 className="text-3xl font-black text-slate-800 italic">Create Admin.</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm"
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest text-sm">
                    Register Account
                </button>

                <p className="text-center text-sm text-slate-500 font-bold mt-4">
                    Already registered? <Link to="/login" className="text-indigo-600 hover:underline">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;