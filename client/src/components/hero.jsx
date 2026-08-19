import { ArrowRight, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const hero = () => {
  const ease = [0.16, 1, 0.3, 1];

  return (
    <>
      <main className="relative z-10 flex h-full flex-col justify-center gap-16 px-6 sm:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-20">
        <motion.section
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease }}
          className="flex flex-1 flex-col justify-center lg:pr-20"
        >
          <span className="mb-5 text-xs font-medium tracking-[0.35em] text-[#CDA24E]">
            YOUR ACCESS POINT
          </span>

          <h1 className="max-w-2xl font-serif text-5xl font-medium leading-tight sm:text-6xl lg:text-7xl">
            Welcome to Nexora
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
            Sign in to pick up where you left off, or create an account in
            seconds.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.7, ease }}
          className="flex flex-1 flex-col items-start lg:items-center"
        >
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Link to="/signUp">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-6 py-5 text-left backdrop-blur-xl transition-colors hover:bg-white/15"
              >
                <div>
                  <p className="text-lg font-medium">Create an account</p>

                  <p className="mt-1 text-sm text-white/50">
                    Start your journey with Nexora
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className="text-[#CDA24E] transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>
            </Link>
            <Link to="/signIn">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-6 py-5 text-left backdrop-blur-xl transition-colors hover:bg-black/30"
              >
                <div>
                  <p className="text-lg font-medium">Sign in</p>

                  <p className="mt-1 text-sm text-white/50">
                    Continue where you left off
                  </p>
                </div>

                <LogIn
                  size={20}
                  className="text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="absolute bottom-6 left-6 z-10 text-xs tracking-[0.3em] text-white/30 sm:left-10"
      >
        NEXORA
      </motion.div>
    </>
  );
};

export default hero;
