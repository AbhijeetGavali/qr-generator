import React from "react";
import { Button } from "./ui/button";
import { set } from "date-fns";
import { Loader } from "lucide-react";

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function PurchaseProButton() {
  const [loading, setLoading] = React.useState(false);
  const purchaseSubscription = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <Button
      className="min-w-[140px]"
      onClick={purchaseSubscription}
      disabled={loading}
    >
      Get Started{" "}
      {loading && (
        <Loader className="animate-spin text-blue-500 w-6 h-6 ml-2" />
      )}
    </Button>
  );
}
