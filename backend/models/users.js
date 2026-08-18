import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    otp: Number,

    isverified: {
      type: Boolean,
      default: false,
    },

    otpExpiry: {
      type: Date,
      default: Date.now,
    },

    passwordResetOTP: Number,

    passwordResetOTPExpiry: {
      type: Date,
      default: null,
    },

    isPasswordResetVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('Users', userSchema);

export default User;
