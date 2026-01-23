import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/SideBar";
import { Box, CircularProgress, Typography } from "@mui/material";
import VerifyEmailBanner from "@/components/VerifyEmailBanner";
import QRAdvanceEditor from "@/components/qr/QRAdvanceEditor";
import { useAuth } from "@/hooks/useAuth";
import QRDashboardTable from "@/components/qr/QRDashboardTable";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { PaymentLoader } from "@/components/PaymentLoader";
import PaymentWaitingPage from "@/components/PaymentWaitingPage";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  const { user } = useAuth();
  const { isActive, loading, status } = useSubscriptionStatus(user?.uid);

  if (loading) return <PaymentLoader message="waiting for payment check" />;

  if (!isActive) return <PaymentWaitingPage />;

  return (
    <>
      <Header />
      <div className="flex" style={{ height: "calc(100vh - 69px)" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: 5,
            marginTop: 2,
          }}
        >
          <div>
            <VerifyEmailBanner />
            <div className="flex items-center justify-end mb-4">
              <Button
                onClick={() => {
                  setSelectedQR(null);
                  setDrawerOpen(true);
                }}
              >
                Create QR
              </Button>
            </div>
            <QRDashboardTable
              userId={user?.uid}
              setSelectedQR={(qr: any) => {
                setDrawerOpen(true);
                console.log("Selected QR:", qr);
                setSelectedQR(qr);
              }}
            />
            <QRAdvanceEditor
              edit={selectedQR ? true : false}
              qrData={selectedQR}
              userId={user?.uid}
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
            />
          </div>
        </Box>
      </div>
    </>
  );
}
