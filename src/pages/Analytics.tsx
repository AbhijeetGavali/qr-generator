import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Analytics() {
  return (
    <>
      <Header />
      <div className="flex" style={{ height: "calc(100vh - 69px)" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: 5, marginTop: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open a QR code’s analytics from the “All QRs” table using the analytics icon.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </div>
    </>
  );
}

