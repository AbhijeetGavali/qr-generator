import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface PhonePopupProps {
  open: boolean;
  onConfirm: (phone: string) => void;
  onClose: () => void;
}

export function PhonePopup({ open, onConfirm, onClose }: PhonePopupProps) {
  const [phone, setPhone] = useState("");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter Phone Number</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Phone Number"
          fullWidth
          variant="standard"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onConfirm(phone)} disabled={!phone}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
