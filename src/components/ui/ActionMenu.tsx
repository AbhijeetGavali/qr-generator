import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MoreVertical, Edit, Trash2, RefreshCw } from "lucide-react";

export function ActionMenu({ qr, onEdit, onDelete, onActivate }: any) {
  // This state stores the button element that was clicked
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertical size={18} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // This ensures the menu stays aligned to the dots
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            onEdit(qr);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Edit size={16} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        {qr.primaryType == "dynamic" &&
          (qr.isActive ? (
            <MenuItem
              onClick={() => {
                onDelete(qr.qrId);
                handleClose();
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon>
                <Trash2 size={16} color="red" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                onActivate(qr.qrId);
                handleClose();
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon>
                <RefreshCw size={16} className="text-success" />
              </ListItemIcon>
              <ListItemText>Activate</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
}
