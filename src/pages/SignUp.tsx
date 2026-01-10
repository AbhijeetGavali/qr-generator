import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  getAuth,
  createUserWithEmailAndPassword,
  validatePassword,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";

import { getPasswordErrors } from "@/utils/passwordValidationHelper";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [, navigate] = useLocation();
  const auth = getAuth();

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPasswordErrors([]);

    if (!agreed) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Firebase password policy validation
      const status = await validatePassword(auth, password);

      if (!status.isValid) {
        setPasswordErrors(getPasswordErrors(status));
        return;
      }

      // 🚀 Create account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );

      const user = userCredential.user;

      // ✉️ Send verification email
      await sendEmailVerification(user, {
        url: `${window.location.origin}/`,
      });

      console.log("Verification email sent");

      // ➜ Redirect to home after successful signup
      navigate("/");
    } catch (err: any) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password does not meet security requirements.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please try again.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const info = getAdditionalUserInfo(result);

      // New Google user
      if (info?.isNewUser) {
        console.log("New Google user created");

        // OPTIONAL: send verification (Google emails are already verified)
        if (!user.emailVerified) {
          await sendEmailVerification(user, {
            url: `${window.location.origin}/`,
          });
        }
      }

      // ✅ Redirect after successful auth
      navigate("/");
    } catch (error: any) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          // Silent — user closed popup
          break;

        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with this email. Please sign in using email & password.",
          );
          break;

        case "auth/network-request-failed":
          setError("Network error. Please try again.");
          break;

        default:
          setError("Google sign-in failed. Please try again.");
          console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });

    return unsubscribe;
  }, [auth, navigate]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center bg-gray-100 py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-center">
            Create Your Account
          </h2>
          <p className="text-center">
            Join and start creating dynamic QR codes
          </p>

          <div className="flex justify-center py-6">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </Button>
          </div>

          <div className="relative my-6">
            <hr />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              Or sign up with email
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <Mail size={18} /> Email
              </Label>
              <Input
                required
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <Lock size={18} /> Password
              </Label>
              <Input
                required
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <Lock size={18} /> Confirm Password
              </Label>
              <Input
                required
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {passwordErrors.length > 0 && (
              <ul className="text-sm text-red-500 list-disc ml-5">
                {passwordErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link
                  href="/terms-of-service"
                  className="text-blue-600 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading ||
                !agreed ||
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <hr className="mt-6" />

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in here
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
