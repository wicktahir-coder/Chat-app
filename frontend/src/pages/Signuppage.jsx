import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [otpValue, setOtpValue] = useState("");

  const { signup, verifyOTP, isSigningUp, isVerifyingOTP, pendingEmail } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (!otpValue.trim() || otpValue.length !== 6)
      return toast.error("Enter the 6-digit OTP");
    verifyOTP(otpValue);
  };

  // ✅ OTP Step — shown after successful signup
  if (pendingEmail) {
    return (
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center items-center w-full p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">

            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Verify Your Email</h1>
                <p className="text-base-content/60">
                  We sent a 6-digit OTP to <span className="font-medium text-base-content">{pendingEmail}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Enter OTP</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full text-center text-2xl tracking-widest font-bold"
                  placeholder="••••••"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isVerifyingOTP}
              >
                {isVerifyingOTP ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/60 text-sm">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  className="link link-primary"
                  onClick={() => signup(formData)}
                  disabled={isSigningUp}
                >
                  resend OTP
                </button>
              </p>
            </div>

          </div>
        </div>
        <AuthImagePattern
          title="One step away"
          subtitle="Verify your email to complete your account setup."
        />
      </div>
    );
  }

  // ✅ Default Signup Step
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center w-full p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 w-full">
                <User className="size-5 text-base-content/40 shrink-0" />
                <input
                  type="text"
                  className="grow"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </label>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 w-full">
                <Mail className="size-5 text-base-content/40 shrink-0" />
                <input
                  type="email"
                  className="grow"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </label>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 w-full">
                <Lock className="size-5 text-base-content/40 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="grow"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="text-base-content/40 hover:text-base-content transition-colors shrink-0"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;