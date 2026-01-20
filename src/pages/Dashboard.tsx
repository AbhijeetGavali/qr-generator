import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/components/firebase";
import { useEffect, useState } from "react";
import QREditor from "@/components/QREditor";
import QRTable from "@/components/QRTable";
import ConfirmModal from "@/components/ConfirmModal";
import Header from "@/components/Header";
import {
  createDynamicQR,
  updateDynamicQR,
  disableDynamicQR,
} from "@/services/qr.service";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/SideBar";
import { Box } from "@mui/material";
import VerifyEmailBanner from "@/components/VerifyEmailBanner";
import QRAdvanceEditor from "@/components/qr/QRAdvanceEditor";
import { useAuth } from "@/hooks/useAuth";
import QRDashboardTable from "@/components/qr/QRDashboardTable";

const defaultQRState = {
  name: "",
  destinationUrl: "",
  qrConfig: {
    dotsOptions: {
      type: "rounded", // rounded | dots | classy | classy-rounded | square
      color: "#000000",
    },
    cornersSquareOptions: {
      type: "extra-rounded", // square | extra-rounded | dot
      color: "#000000",
    },
    cornersDotOptions: {
      type: "dot", // dot | square
      color: "#000000",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  },
};

export default function Dashboard() {
  const [qrs, setQrs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [deleteQR, setDeleteQR] = useState<any>(null);

  const { user } = useAuth();

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
            <QRDashboardTable userId={user?.uid} />
            <ConfirmModal
              open={!!deleteQR}
              onCancel={() => setDeleteQR(null)}
              onConfirm={() => {
                disableDynamicQR(deleteQR?.id || "");
                setDeleteQR(null);
              }}
            />
            <QRAdvanceEditor
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
