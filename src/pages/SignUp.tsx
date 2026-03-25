import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HoneycombPattern from "../components/ui/HoneyCombPattern";
import BillingBeeLogo from "../components/ui/BillingBeeLogo";
import { signupUser } from "../services/AuthService";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 NEW FIELDS
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !businessName || !phone) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await signupUser({
        name,
        email,
        password,
        businessName,
        address,
        phone,
        gstNumber,
      });

      navigate("/login"); // better UX

    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 overflow-hidden">

      <HoneycombPattern />

      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] p-10">

        <div className="flex justify-center mb-8">
          <BillingBeeLogo size={42} />
        </div>

        <h2 className="text-2xl font-semibold text-center text-white">
          Create your account
        </h2>

        <p className="text-sm text-gray-400 text-center mt-2 mb-8">
          Setup your business to start billing
        </p>

        {error && (
          <div className="mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* USER DETAILS */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full input"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full input"
          />

          {/* 🔥 BUSINESS DETAILS */}
          <div className="border-t border-white/10 pt-4 text-sm text-gray-400">
            Business Details
          </div>

          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full input"
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full input"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full input"
          />

          <input
            type="text"
            placeholder="GST Number (Optional)"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            className="w-full input"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-black bg-yellow-400 hover:bg-yellow-500 transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-yellow-400 hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
};

export default Signup;