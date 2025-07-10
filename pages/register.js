import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useUser } from '../contexts/UserContext';
import { Mail, Lock, Gift, ArrowRight, Facebook, Apple, CircleUserRound } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState('signup');
  const router = useRouter();
  const { login } = useUser();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Registration logic here (same as before)
      setTimeout(() => {
        setSuccess('Registration successful!');
        setLoading(false);
      }, 1200);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/30 mt-16 mb-16 h-[500px]">
        {/* Left: Form */}
        <div className="md:w-1/2 p-10 md:p-6 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-gray-900 mb-3">Join FoodBridge</h1>
            <p className="text-[1rem] text-[#45a180] font-light">Help reduce food waste and support communities in Malaysia</p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <CircleUserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/80 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none transition-all"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm bg-red-100 border border-red-200 rounded-full py-2 px-4 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm bg-green-100 border border-green-200 rounded-full py-2 px-4 text-center">
                {success}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-full font-semibold py-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          {/* Login Link */}
          <div className="pt-6">
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <a href="/login" className="underline text-[#45a180] hover:text-[#37806b] transition-colors">Sign in here</a>
            </p>
          </div>
        </div>
        {/* Right: Illustration & Description */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-white/80 via-emerald-50 to-emerald-100 items-center justify-center relative">
          <div className="flex flex-col items-center justify-center w-full h-full p-0 m-0 relative">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/food-donation-bags.jpg"
                alt="Register Illustration"
                fill
                className="object-cover w-full h-full rounded-none"
                priority
              />
            </div>
            {/* <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-white/80 via-transparent to-transparent">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">Trade</h2>
              <p className="text-gray-500 text-center">anything anywhere with FoodBridge!</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
