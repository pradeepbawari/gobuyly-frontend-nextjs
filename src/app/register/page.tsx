'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userRegister } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile_number: '',
    address: '',
    gstin: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await userRegister({ form });
    setLoading(false);

    if (result.error) {
      setError(result.error)
    } else {
      setError(result.message)
      const time = setTimeout(() => {
        router.push('/login');
      }, 600);      
      return () => clearTimeout(time); 
    }
  } catch (err) {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center from-emerald-500 to-teal-600 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account 🚀
        </h2>
      {error && <div className='p5 text-red-600 mb-3'>{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <input
            name="mobile_number"
            placeholder="Phone Number"
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <input
            name="gstin"
            placeholder="GST Number (Optional)"
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <input
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition mt-2"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-teal-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
