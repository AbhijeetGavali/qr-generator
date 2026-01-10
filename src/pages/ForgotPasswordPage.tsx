import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const auth = getAuth();
  const [, navigate] = useLocation();

  // 🔐 Redirect logged-in users
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return unsub;
  }, [auth, navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      setSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email to reset your password.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Unable to send email",
        description: error?.message || "Please check your email and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center bg-gray-100 py-24 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-center">
            Forgot your password?
          </h2>
          <p className="text-center text-sm text-gray-600 mt-1">
            Enter your email and we’ll send you a reset link.
          </p>

          {sent ? (
            <div className="mt-6 text-center space-y-4">
              <p className="text-green-600 text-sm">
                Password reset email sent successfully.
              </p>
              <Link
                to="/login"
                className="text-blue-600 hover:underline text-sm"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 mt-6">
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <Mail size={18} /> Email
                </Label>
                <Input
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
