import { subscribe } from "@/components/pricing/Subscription";
import { Button } from "@/components/ui/button";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect } from "react";

export default function Subscribe() {
  const auth = getAuth();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login";
      }
    });
    return unsub;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      
    </div>
  );
}
