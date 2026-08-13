import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/admin/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.user));
                navigate('/admin/dashboard/owners');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
            <div className="w-full max-w-[440px] bg-white border border-slate-200 rounded-xl shadow-sm p-8 sm:p-10">

                <div className="mb-8">
                    <h2 className="text-[#226a5b] text-xl font-bold tracking-tight mb-4">KonkanTrip</h2>
                    <h1 className="text-[28px] font-bold text-slate-800 leading-tight">Welcome back</h1>
                    <p className="text-sm text-slate-500 mt-1.5">Sign in to manage the platform.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Email address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-[#226a5b] focus:ring-1 focus:ring-[#226a5b] transition-shadow placeholder:text-slate-400"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-[#226a5b] focus:ring-1 focus:ring-[#226a5b] transition-shadow placeholder:text-slate-400"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#226a5b] hover:bg-[#1a5548] text-white font-semibold rounded-lg shadow-sm transition-colors duration-200 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[13px] text-slate-500">
                        Forgot your password? <br />
                        <span className="text-[#226a5b] font-medium mt-1 cursor-pointer hover:underline">Contact System Admin</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
