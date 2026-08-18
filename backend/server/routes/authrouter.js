import { Router } from 'express';
import {
  registerSchema,
  signinSchema,
  verifyOTPValidation,
  resendotpValdition,
} from '../utils/validations.js';
import { checkSchema } from 'express-validator';
import {
  register,
  verifyOTP,
  resendOTP,
  signin,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  refresh,
  logout,
} from '../controllers/authcontrollers.js';
const router = Router();
router.post('/register', checkSchema(registerSchema), register);
router.post('/verify-email', checkSchema(verifyOTPValidation), verifyOTP);
router.post('/resend-otp', checkSchema(resendotpValdition), resendOTP);
router.post('/signin', checkSchema(signinSchema), signin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/refresh', refresh);
router.post('/logOut', logout);
export default router;
