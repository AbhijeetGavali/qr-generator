import { db } from "@/components/firebase";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { doc, getDoc } from "firebase/firestore";

export default function PayUSuccess() {
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

        if (docSnap.exists() && docSnap.data()?.status === "success") {
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

  // 3. Success State
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <Card className="max-w-md w-full shadow-xl rounded-2xl p-4">
        <CardContent className="text-center space-y-4">
          <CheckCircle className="text-green-600 w-16 h-16 mx-auto" />

          <Typography variant="h5" fontWeight="bold">
            Subscription Activated 🎉
          </Typography>

          <Typography color="text.secondary">
            Your payment was successful. You now have full access to your
            dashboard.
          </Typography>

          <div className="pt-4">
            <Button
              variant="contained"
              color="success"
              fullWidth
              size="large"
              style={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => setLocation("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
