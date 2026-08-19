import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../contexts/authcontexts.jsx';
const SignInForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/signin', formData);
      login(data.userData, data.accessToken);
      navigate('/profile');
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-3xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-2xl sm:p-8"
    >
      <p className="mb-2 text-xs font-medium tracking-[0.35em] text-[#CDA24E]">
        WELCOME BACK
      </p>

      <h1 className="mb-2 font-serif text-3xl font-medium sm:text-4xl">
        Sign in
      </h1>

      <p className="mb-7 text-sm leading-relaxed text-white/50">
        Welcome back. Sign in to continue your journey with Nexora.
      </p>
      {error && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          required={true}
          onChange={handleChange}
          value={formData.email}
          placeholder="Email address"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-[#CDA24E]/60 focus:bg-black/30"
        />

        <input
          type="password"
          name="password"
          required={true}
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-[#CDA24E]/60 focus:bg-black/30"
        />

        <motion.button
          type="submit"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#CDA24E] px-4 py-3.5 font-medium text-[#0A0D16] transition-colors hover:bg-[#DFB562]"
        >
          {loading ? 'Signing in...' : 'Sign in'}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Don’t have an account?{' '}
        <Link
          to="/signUp"
          className="font-medium text-[#CDA24E] transition-colors hover:text-[#DFB562] hover:underline"
        >
          Create one
        </Link>
      </p>
    </motion.div>
  );
};

export default SignInForm;
