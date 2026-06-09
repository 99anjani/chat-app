
import React, { useState } from "react";
import { TbLogin2 } from "react-icons/tb";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, addNotification } from "../firebase/firebase";
import toast from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";

const Login = ({ isLogin, setIsLogin }) => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async () => {
    if (!userData.email || !userData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.password);

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await addNotification(
          auth.currentUser.uid,
          "You have successfully logged in",
          "login"
        );
      }

      toast.success("Welcome back!");
    } catch (error) {
      if (error.code === "auth/user-not-found") toast.error("No account found");
      else if (error.code === "auth/wrong-password") toast.error("Wrong password");
      else toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 via-sky-950 to-slate-900 p-6">

      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg mb-4">
            <TbLogin2 size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-white/60">Sign in to continue</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-white/70">Email</label>
          <input
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-indigo-500 autofill:bg-transparent"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-white/70">Password</label>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={userData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-indigo-500"
              placeholder="Enter password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            >
              {showPassword ? "🙈" : "👁️"} 
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white font-semibold transition disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign in"}
          {!isLoading && <TbLogin2 size={18} />}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-white/50 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;