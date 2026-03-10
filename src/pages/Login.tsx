import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HoneycombPattern from "../components/ui/HoneyCombPattern";
import BillingBeeLogo from "../components/ui/BillingBeeLogo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">

      <HoneycombPattern />

      {/* Center Card */}
      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] p-10">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BillingBeeLogo size={42} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-white">
          Sign in to your account
        </h2>

        <p className="text-sm text-gray-400 text-center mt-2 mb-8">
          Professional billing for modern businesses
        </p>

        {/* Error */}
        {error && (
          <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 pr-12 text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-yellow-400/70
                           transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login Button */}
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
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          <button className="text-sm text-yellow-400 hover:underline">
            Forgot password?
          </button>

          <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Secure encrypted connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;