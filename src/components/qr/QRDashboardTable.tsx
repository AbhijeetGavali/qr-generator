import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Avatar,
} from "@mui/material";
import {
  BarChart2,
  MoreVertical,
  ExternalLink,
  QrCode,
  Globe,
  Smartphone,
} from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { ActionMenu } from "../ui/ActionMenu";

export default function QRDashboardTable({ userId, setSelectedQR }: any) {
  const [qrcodes, setQrcodes] = useState<Array<any>>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "qrcodes"),
      where("ownerId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const qrArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQrcodes(qrArray);
    });

    return () => unsubscribe();
  }, [userId]);

  const deleteSelectedQR = async (qrId: string) => {
    try {
      // Delete the QR code document from Firestore
      const qrRef = doc(db, "qrcodes", qrId);

      // Perform soft delete by updating flags
      await updateDoc(qrRef, {
        isActive: false,
        deletedAt: serverTimestamp(),
      });

      console.log("QR code deleted successfully");
    } catch (error) {
      console.error("Error deleting QR code: ", error);
    }
  };

  const activateSelectedQR = async (qrId: string) => {
    try {
      // Delete the QR code document from Firestore
      const qrRef = doc(db, "qrcodes", qrId);

      // Perform soft delete by updating flags
      await updateDoc(qrRef, {
        isActive: true,
      });

      console.log("QR code activated successfully");
    } catch (error) {
      console.error("Error activating QR code: ", error);
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="qr code dashboard">
        <TableHead sx={{ bgcolor: "grey.50" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>QR Code & Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total Scans</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Device Split</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Last Scanned</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qrcodes.map((qr: any) => (
            <TableRow
              key={qr.qrId}
              hover
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {/* Name & ID */}
              <TableCell component="th" scope="row">
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "primary.light", width: 40, height: 40 }}
                  >
                    <QrCode size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {qr.name || "Untitled QR"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {qr.qrId}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Type Chip */}
              <TableCell>
                <Chip
                  label={qr.primaryType?.toUpperCase()}
                  size="small"
                  color={qr.primaryType === "dynamic" ? "primary" : "default"}
                  variant={qr.primaryType === "dynamic" ? "filled" : "outlined"}
                  sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
                />
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 0.5, color: "text.secondary" }}
                >
                  {qr.qrType}
                </Typography>
              </TableCell>

              {/* Scan Count */}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {qr.scanCount || 0}
                  </Typography>
                  <BarChart2 size={14} className="text-gray-400" />
                </Box>
              </TableCell>

              {/* Device Insight */}
              <TableCell>
                <Box sx={{ display: "flex", gap: 1, color: "text.secondary" }}>
                  <Tooltip
                    title={`Mobile: ${qr.analytics?.devices?.mobile || 0}`}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Smartphone size={14} />
                      <Typography variant="caption">
                        {qr.analytics?.devices?.mobile || 0}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip
                    title={`Desktop: ${qr.analytics?.devices?.desktop || 0}`}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Globe size={14} />
                      <Typography variant="caption">
                        {qr.analytics?.devices?.desktop || 0}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Chip
                  label={qr.isActive ? "Active" : "Paused"}
                  size="small"
                  sx={{
                    bgcolor: qr.isActive ? "success.lighter" : "error.lighter",
                    color: qr.isActive ? "success.dark" : "error.dark",
                    fontSize: "0.75rem",
                  }}
                />
              </TableCell>

              {/* Date */}
              <TableCell>
                <Typography variant="caption">
                  {qr.lastScanned
                    ? new Date(qr.lastScanned.seconds * 1000).toLocaleString()
                    : "No scans yet"}
                </Typography>
              </TableCell>

              {/* Actions */}
              <TableCell align="right">
                <Tooltip title="View Link">
                  <IconButton
                    size="small"
                    component="a"
                    href={qr.payload}
                    target="_blank"
                  >
                    <ExternalLink size={18} />
                  </IconButton>
                </Tooltip>
                <ActionMenu
                  qr={qr}
                  onEdit={setSelectedQR}
                  onDelete={deleteSelectedQR}
                  onActivate={activateSelectedQR}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
