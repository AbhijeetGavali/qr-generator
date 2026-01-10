import React from "react";
import { Button } from "./ui/button";

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function PurchaseProButton() {
  const purchaseSubscription = async () => {
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create payment session");
      }

      const data = await res.json();

      if (!data.paymentSessionId) {
        throw new Error("Payment session not created");
      }

      const cashfree = new window.Cashfree();
      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    }
  };

  return (
    <Button className="min-w-[140px]" onClick={purchaseSubscription}>
      Get Started
    </Button>
  );
}
