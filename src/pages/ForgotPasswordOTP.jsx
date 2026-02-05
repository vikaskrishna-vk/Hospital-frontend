import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

/**
 * OTP-Based Forgot Password Page Component (NEW)
 * Step 1: Request OTP
 * Step 2: Verify OTP and reset password
 */
const ForgotPasswordOTP = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP & Reset Password
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authAPI.requestPasswordResetOTP({ email });
      setSuccess("Password sent to your registered mail");
      setOtpSent(true);
      setStep(2);

      // Show dev OTP in development mode
      if (response.data.devOTP) {
        console.log("🔐 DEV OTP:", response.data.devOTP);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (formData.otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPasswordWithOTP({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      setSuccess("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to reset password";
      setError(errorMsg);

      // Extract remaining attempts from error message
      const attemptsMatch = errorMsg.match(/(\d+) attempt\(s\) remaining/);
      if (attemptsMatch) {
        setRemainingAttempts(parseInt(attemptsMatch[1]));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authAPI.requestPasswordResetOTP({ email });
      setSuccess("New OTP sent to your email!");
      setRemainingAttempts(5);
      setFormData({ otp: "", newPassword: "", confirmPassword: "" });

      if (response.data.devOTP) {
        console.log("🔐 DEV OTP:", response.data.devOTP);
        alert(`DEV MODE: Your new OTP is ${response.data.devOTP}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 1 ? "🔒 Forgot Password" : "🔐 Reset Password"}
          </h1>
          <p className="text-gray-600">
            {step === 1
              ? "Enter your email to receive a verification code"
              : "Enter the OTP sent to your email"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">{error}</p>
            {remainingAttempts < 5 && remainingAttempts > 0 && (
              <p className="text-sm mt-1">
                ⚠️ {remainingAttempts} attempt(s) remaining
              </p>
            )}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your registered email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP and Reset Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Email Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">OTP sent to:</p>
              <p className="font-semibold text-gray-800">{email}</p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                maxLength={6}
                pattern="\d{6}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                ⏱️ OTP expires in 10 minutes
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
              >
                Didn't receive OTP? Resend
              </button>
            </div>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Security Note */}
        {step === 2 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-gray-700">
              <strong>🔐 Security Tips:</strong>
            </p>
            <ul className="text-xs text-gray-600 mt-2 space-y-1">
              <li>• Never share your OTP with anyone</li>
              <li>
                • You have {remainingAttempts} attempt(s) to enter the correct
                OTP
              </li>
              <li>• OTP will expire in 10 minutes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;
