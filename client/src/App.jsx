import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/homepage.jsx';
import SignUpPage from './pages/signUpPage.jsx';
import SignInPage from './pages/signInPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import Profilepage from './pages/profilepage.jsx';
const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/signUp', element: <SignUpPage /> },
  { path: '/signIn', element: <SignInPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  { path: '/profile', element: <Profilepage /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
