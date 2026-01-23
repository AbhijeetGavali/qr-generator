import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { AlertCircle } from "lucide-react";
import { db } from "@/components/firebase";
import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { doc, getDoc } from "firebase/firestore";

export default function PayUFailure() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();

  // Extract txnid using standard URLSearchParams
  const searchParams = new URLSearchParams(searchString);
  const txnid = searchParams.get("txnid");

  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!txnid) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const docRef = doc(db, "subscriptions", txnid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data()?.status === "failure") {
          setIsValid(true);
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [txnid]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <CircularProgress color="success" />
        <Typography className="mt-4 font-medium text-gray-600">
          Confirming payment...
        </Typography>
      </div>
    );
  }

  // 2. Error/Unauthorized State
  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <Card className="max-w-md w-full shadow-lg rounded-2xl p-6 text-center">
          <AlertCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <Typography variant="h6" gutterBottom>
            Payment Not Verified
          </Typography>
          <Typography color="text.secondary" className="mb-6">
            We couldn't find a successful transaction record for this ID.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => setLocation("/")}
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <Card className="max-w-md w-full shadow-xl rounded-2xl">
        <CardContent className="text-center space-y-4">
          <AlertCircle className="text-red-600 text-6xl mx-auto" />

          <Typography variant="h5" fontWeight="bold">
            Subscription Failed
          </Typography>

          <Typography color="text.secondary">
            We couldn’t complete your subscription setup. No money has been
            deducted.
          </Typography>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => window.history.back()}
            >
              Try Again
            </Button>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
