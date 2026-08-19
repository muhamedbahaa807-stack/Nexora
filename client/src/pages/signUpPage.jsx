import Background from '../components/Background.jsx';
import SignUpForm from '../components/SignUpForm.jsx';

const SignUpPage = () => {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#05060A] px-6 text-white">
      <Background />

      <main className="relative z-10 w-full max-w-md">
        <SignUpForm />
      </main>
    </div>
  );
};

export default SignUpPage;
