import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HoneycombPattern from "../../components/ui/HoneyCombPattern";
import BillingBeeLogo from "../../components/ui/BillingBeeLogo";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/AuthService";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or expired link");
      return;
    }

    setLoading(true);

    // TEMP mock
    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset successful");
      navigate("/");
    }, 1200);
  };

  const handleResetPassword = async () => {
  try {
    await resetPassword({
      token,
      newPassword: confirmPassword
    });

    alert("Password reset successful!");
  } catch (error) {
    console.error(error);
    alert("Invalid or expired token");
  }
};
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">

      <HoneycombPattern  />

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10">

        <div className="flex justify-center mb-8">
          <BillingBeeLogo size={42} />
        </div>

        <h2 className="text-2xl text-white text-center font-semibold">
          Reset Password
        </h2>

        <p className="text-gray-400 text-center mt-2 mb-8 text-sm">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20"
          />

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;