import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

export default function LoginPage() {
  const auth = getAuth();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  // 🔐 Redirect logged-in users
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return unsub;
  }, [auth, navigate]);

  // 📧 Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );

      const { user } = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );

      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }

      navigate("/");
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please try again.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const info = getAdditionalUserInfo(result);

      if (info?.isNewUser) {
        console.log("New Google user logged in");
      }

      navigate("/");
    } catch (err: any) {
      switch (err.code) {
        case "auth/popup-closed-by-user":
          break;
        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with this email. Use email & password.",
          );
          break;
        default:
          setError("Google sign-in failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center bg-gray-100 py-24 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
          <p className="text-center">Sign in to your account</p>

          {/* Google */}
          <div className="flex justify-center py-6">
            <Button
              variant="outline"
              className="w-full flex gap-3"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
              />
              Continue with Google
            </Button>
          </div>

          <div className="relative my-6">
            <hr />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              Or sign in with email
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <Mail size={18} /> Email
              </Label>
              <Input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <Lock size={18} /> Password
              </Label>
              <Input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-between text-sm items-center">
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <hr className="mt-6" />

          <p className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create one here
            </Link>
          </p>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500">
          Protected by advanced security and encryption
        </p>
      </div>
      <Footer />
    </>
  );
}
