import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getStrength = () => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Medium";
  };

  const handleUpdate = async () => {
    if (!password.trim()) {
      toast.error("Enter new password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully ✅");
      navigate("/login");
    }
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your new password
        </p>

        {/* 🔐 Password Field */}
        <div className="relative mb-3">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <input
            autoFocus
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border py-3 pl-10 pr-10 bg-background focus:ring-2 focus:ring-primary outline-none"
          />

          {/* 👁️ Eye Toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* 🔁 Confirm Password */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border py-3 px-4 mb-3 bg-background focus:ring-2 focus:ring-primary outline-none"
        />

        {/* 💪 Strength Indicator */}
        <p
          className={`text-xs mb-4 ${
            strength === "Strong"
              ? "text-green-500"
              : strength === "Medium"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          Strength: {strength}
        </p>

        {/* 🚀 Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full py-3 rounded-xl gradient-hero text-white font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </motion.div>
    </div>
  );
}
