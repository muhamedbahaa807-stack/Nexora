import { motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useNavigate } from 'react-router-dom';
const OtpForm = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const email = localStorage.getItem('verifyEmail');
  const [otp, setOtp] = useState(['', '', '', '', '']);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    const digit = value.slice(-1);

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = digit;
      return newOtp;
    });

    if (digit && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedCode = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 5);

    pastedCode.split('').forEach((digit, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = digit;
      }
    });

    const nextIndex = Math.min(pastedCode.length, 4);
    inputsRef.current[nextIndex]?.focus();
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handlesend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = {
        email,
        otp: Number(otp.join('')),
      };
      console.log(formData);
      await api.post('/verify-email', formData);
      navigate('/signIn');
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    try {
      await api.post('/resend-otp', { email });
      setTimeLeft(60);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 1.2,
        delay: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-7 text-center shadow-2xl backdrop-blur-2xl sm:p-8"
    >
      <p className="mb-2 text-xs font-medium tracking-[0.35em] text-[#CDA24E]">
        VERIFY EMAIL
      </p>

      <h1 className="mb-3 font-serif text-3xl font-medium sm:text-4xl">
        Check your inbox
      </h1>

      <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/50">
        We sent a verification code to your email address. Enter the code below
        to continue.
      </p>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 w-full rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </motion.div>
      )}
      <form onSubmit={handlesend}>
        <div className="mt-8 flex justify-center gap-2 sm:gap-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              required={true}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="h-12 w-10 rounded-xl border border-white/10 bg-black/20 text-center text-lg font-medium text-white outline-none transition focus:border-[#CDA24E]/70 focus:bg-black/30 focus:shadow-[0_0_20px_rgba(205,162,78,0.12)] sm:h-14 sm:w-12 sm:text-xl"
            />
          ))}
        </div>

        <motion.button
          type="submit"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CDA24E] px-4 py-3.5 font-medium text-[#0A0D16] transition-colors hover:bg-[#DFB562]"
        >
          {loading ? 'Verify...' : 'Verify email'}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </motion.button>
      </form>
      <p className="mt-6 text-sm text-white/50">
        Didn’t receive the code?{' '}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`text-sm font-medium transition ${
              timeLeft > 0
                ? 'cursor-not-allowed text-white/30'
                : 'text-[#CDA24E] hover:text-[#DFB562] hover:underline'
            }`}
          >
            {timeLeft > 0 ? `Resend code in ${timeLeft}s` : 'Resend code'}
          </button>
        </div>
      </p>
    </motion.div>
  );
};

export default OtpForm;
