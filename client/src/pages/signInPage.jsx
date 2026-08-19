import Background from '../components/background.jsx';
import SignInform from '../components/signInform.jsx';
const signInPage = () => {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#05060A] px-6 text-white">
      <Background />

      <main className="relative z-10 w-full max-w-md">
        <SignInform />
      </main>
    </div>
  );
};

export default signInPage;
