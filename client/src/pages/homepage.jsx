import Hero from '../components/hero.jsx';
import Background from '../components/background.jsx';
const homepage = () => {
  const ease = [0.16, 1, 0.3, 1];

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <Background />
      <Hero />
    </div>
  );
};

export default homepage;
