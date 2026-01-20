import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/components/firebase";

export default function Redirect() {
  const [, params] = useRoute("/r/:id");
  const [status, setStatus] = useState("loading");
  // 🛠️ Lock to prevent double execution
  const hasRun = useRef(false);

  useEffect(() => {
    const handleRedirect = async () => {
      const id = params?.id;
      if (!id || hasRun.current) return;
      hasRun.current = true; // Set lock immediately

      try {
        const qrRef = doc(db, "qrcodes", id);
        const snap = await getDoc(qrRef);

        if (!snap.exists()) {
          setStatus("not-found");
          return;
        }

        const data = snap.data();
        const destination = data.payload;

        if (!destination) {
          setStatus("not-found");
          return;
        }

        // --- ENHANCED ANALYTICS ---
        const today = new Date().toISOString().slice(0, 10);
        const userAgent = window.navigator.userAgent;

        // Simple Device Detection
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
        const deviceType = isMobile ? "mobile" : "desktop";

        // Simple Browser Detection
        let browser = "Other";
        if (userAgent.includes("Chrome")) browser = "Chrome";
        else if (userAgent.includes("Safari")) browser = "Safari";
        else if (userAgent.includes("Firefox")) browser = "Firefox";

        const referrer = document.referrer
          ? new URL(document.referrer).hostname
          : "direct";

        const analyticsUpdate: any = {
          scanCount: increment(1),
          lastScanned: serverTimestamp(),
          [`analytics.dailyScans.${today}`]: increment(1),
          [`analytics.devices.${deviceType}`]: increment(1),
          [`analytics.browsers.${browser}`]: increment(1),
          [`analytics.referrers.${referrer.replace(/\./g, "_")}`]: increment(1),
        };

        // Update Firestore (Fire and forget)
        await updateDoc(qrRef, analyticsUpdate).catch((err) =>
          console.error("Analytics failed", err),
        );

        setStatus("redirecting");

        // Final Redirect
        // window.location.replace(destination);
      } catch (error) {
        console.error("Redirect error:", error);
        setStatus("not-found");
      }
    };

    handleRedirect();
  }, [params]);

  // --- UI Render ---
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Resolving your smart link...
            </p>
          </div>
        )}

        {status === "redirecting" && (
          <p className="text-sm font-medium">Taking you there now...</p>
        )}

        {status === "not-found" && (
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Link Expired or Invalid</h1>
            <p className="text-sm text-muted-foreground">
              This QR code is no longer active or the link is broken.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
