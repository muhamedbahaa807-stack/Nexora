import { motion } from 'motion/react';

const Background = () => {
  const ease = [0.16, 1, 0.3, 1];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-dvh w-dvw overflow-hidden">
      <motion.img
        src="/background.jpg"
        alt=""
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
};

export default Background;
