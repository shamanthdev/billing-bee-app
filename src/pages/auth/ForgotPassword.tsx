import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HoneycombPattern from "../../components/ui/HoneyCombPattern";
import BillingBeeLogo from "../../components/ui/BillingBeeLogo";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/AuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    // TEMP: simulate API
    setTimeout(() => {
      setLoading(false);
      toast.success("Reset link sent to your email");

      // later replace with API call
    }, 1200);
  };

    const handleForgotPassword = async () => {
  try {
    await forgotPassword(email); // email is string
    alert("Reset link sent! Check console/logs");
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">

      <HoneycombPattern />

      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] p-10">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BillingBeeLogo size={42} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-white">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-400 text-center mt-2 mb-8">
          Enter your email to receive a reset link
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/70
                         transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-black
              bg-yellow-400 hover:bg-yellow-500
              transition-all duration-200
              hover:shadow-lg hover:shadow-yellow-500/20
              active:scale-[0.98]
              ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
            onClick={handleForgotPassword}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-yellow-400 hover:underline"
          >
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;