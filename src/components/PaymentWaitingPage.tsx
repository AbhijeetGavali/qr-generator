import { Card, CardContent, Button } from "@mui/material";
import { Clock, ShieldCheck, CreditCard, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Header from "./Header";
import { subscribe } from "./pricing/Subscription";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "firebase/auth";

export default function PaymentWaitingPage() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-slate-50 flex items-center justify-center p-4 m-auto flex-grow">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
            <div className="bg-blue-600 h-2 w-full" />
            <CardContent className="p-8 text-center">
              <>
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="animate-spin-slow" size={40} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  Finalizing Payment
                </h1>
                <p className="text-slate-500 mb-8">
                  We're waiting for PayU to confirm your transaction. This
                  usually takes a few seconds.
                </p>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl mb-8">
                  <div className="flex items-center text-sm text-slate-600">
                    <CreditCard size={16} className="mr-3" />
                    <span>Secure Encryption Active</span>
                  </div>
                </div>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  className="rounded-xl border-slate-200 text-slate-600 normal-case font-semibold"
                  disabled={loading}
                >
                  I've already paid (Refresh)
                </Button>
                <div className="mt-2" />
                <Button
                  variant="contained"
                  fullWidth
                  className="rounded-xl border-slate-200 text-slate-600 normal-case font-semibold mt-4"
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    subscribe(auth?.user as User);
                  }}
                >
                  Subscribe
                  {loading && (
                    <Loader className="animate-spin text-blue-500 w-6 h-6 ml-2" />
                  )}
                </Button>
              </>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
