import User from '../../models/users.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import { hashing, comparePassword } from '../utils/hashPassword.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

//email transporter set up
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready');
  }
});
//Generate OTP
const generateOTP = () => crypto.randomInt(10000, 99999).toString();

//register controller (post to '/register')
export const register = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }
  const body = req.body;
  const hashedPassword = hashing(body.password);
  const ifEmailuserexist = await User.findOne({ email: body.email });
  const ifPhoneuserexist = await User.findOne({ phone: body.phone });
  if (ifEmailuserexist) {
    const error = new Error('This email is already have an account');
    error.status = 409;
    throw error;
  }
  if (ifPhoneuserexist) {
    const error = new Error('This phone number is already exist');
    error.status = 409;
    throw error;
  }
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await User.create({ ...body, password: hashedPassword, otp, otpExpiry });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: body.email,
    subject: 'OTP Verification',
    text: `your OTP is: ${otp}`,
  });

  res
    .status(201)
    .json({ message: 'Account registered. Please verify OTP sent to email' });
};

//verify OTP controller (post to '/verify-email')
export const verifyOTP = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found');
    error.status = 400;
    throw error;
  }
  if (user.isverified) {
    const error = new Error('User already verified');
    error.status = 400;
    throw error;
  }
  if (user.otp !== otp || user.otpExpiry < new Date()) {
    const error = new Error('Invalid or expired OTP');
    error.status = 400;
    throw error;
  }
  user.isverified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res
    .status(200)
    .json({ message: 'Email verified successfully. You can now log in.' });
};

//resend OTP controller (post to '/resend-otp')
export const resendOTP = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found');
    error.status = 400;
    throw error;
  }
  if (user.isverified) {
    const error = new Error('User already verified');
    error.status = 400;
    throw error;
  }
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP Verification',
    text: `your OTP is: ${otp}`,
  });
  res.json({ message: 'OTP resent successfully.' });
};

//SignIN controller (post to '/signin')
export const signin = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = new Error(result.array()[0].msg);
    error.status = 400;
    throw error;
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('This email does not exist');
    error.status = 401;
    throw error;
  }
  const isMatching = comparePassword(password, user.password);
  if (!isMatching) {
    const error = new Error('Password wrong');
    error.status = 401;
    throw error;
  }
  if (!user.isverified) {
    const error = new Error('you need to verify email');
    error.status = 400;
    throw error;
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60000 * 60 * 24 * 30,
  });
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
  res
    .status(200)
    .json({ message: 'Login  successfully', userData, accessToken });
};
//REFRESH controller (post to '/refresh)
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const error = new Error('Refresh token is missing');
    error.status = 401;
    throw error;
  }
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error('Invalid or expired refresh token');
    error.status = 401;
    throw error;
  }
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);

  return res.status(200).json({
    accessToken,
  });
};

//FORGET PASSWORD controller (post to '/forgot-password')
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const otp = generateOTP();

  user.passwordResetOTP = otp;
  user.passwordResetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await transporter.sendMail({
    from: `"Nexora" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Nexora Password Reset',
    text: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
  });

  res.status(200).json({
    message: 'Password reset OTP sent successfully',
  });
};

//verifyforgetpassword conrtoller
export const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  if (user.passwordResetOTP !== Number(otp)) {
    const error = new Error('Invalid OTP');
    error.status = 400;
    throw error;
  }
  if (user.passwordResetOTPExpiry < new Date()) {
    const error = new Error('OTP has expired');
    error.status = 400;
    throw error;
  }
  user.isPasswordResetVerified = true;
  await user.save();
  res.status(200).json({
    message: 'OTP verified successfully',
  });
};

//NEWPASSWORD controller
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (!user.isPasswordResetVerified) {
    const error = new Error('You need to verify OTP first');
    error.status = 400;
    throw error;
  }

  const hashedPassword = hashing(newPassword);

  user.password = hashedPassword;

  user.passwordResetOTP = null;
  user.passwordResetOTPExpiry = null;
  user.isPasswordResetVerified = false;

  await user.save();

  res.status(200).json({
    message: 'Password reset successfully',
  });
};

//LOGOUT controller (post to '/logout')
export const logout = (req, res) => {
  res.clearCookie('refreshToken');

  return res.status(200).json({
    message: 'Logged out successfully',
  });
};
