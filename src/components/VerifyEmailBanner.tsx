import { getAuth, sendEmailVerification, reload } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function VerifyEmailBanner() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");

  // 🔍 Decide visibility
  useEffect(() => {
    if (user && !user.emailVerified) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [user]);

  // ⏱ Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  if (!visible) return null;

  const resendVerification = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setMessage("");

      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`,
      });

      setMessage("Verification email sent. Please check your inbox.");
      setCooldown(60); // ⛔ prevent abuse
    } catch (err) {
      setMessage("Failed to send verification email. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await reload(user);

      if (user.emailVerified) {
        setVisible(false);
      } else {
        setMessage("Email not verified yet.");
      }
    } catch {
      setMessage("Unable to refresh verification status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-900">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm">
          <strong>Verify your email address.</strong> Please check your inbox to
          unlock all features.
          {message && (
            <div className="text-xs mt-1 text-yellow-800">{message}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStatus}
            disabled={loading}
          >
            I’ve verified
          </Button>

          <Button
            size="sm"
            onClick={resendVerification}
            disabled={loading || cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
