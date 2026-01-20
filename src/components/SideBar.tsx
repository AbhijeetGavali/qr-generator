// src/Sidebar.tsx
import { useAuth } from "@/hooks/useAuth";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { QrCodeIcon, SquareActivityIcon } from "lucide-react";
import { useLocation } from "wouter";

const Sidebar = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        marginTop: "5em",
        marginLeft: "1em",
        borderRadius: "10px",
        border: "1px solid #E5E4E2",
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          marginTop: "5em",
          borderRadius: "10px",
          marginLeft: "1em",
          border: "1px solid #E5E4E2",
        },
      }}
    >
      <List>
        <ListItem>
          <ListItemText
            primary={`Hello ${user?.displayName?.split(" ")[0]},`}
          />
        </ListItem>
        {[
          { text: "All QRs", icon: <QrCodeIcon />, link: "/" },
          {
            text: "Analytics",
            icon: <SquareActivityIcon />,
            link: "/analytics",
          },
        ].map((text) => (
          <ListItem
            key={text.text}
            onClick={() => navigate(text.link)}
            style={{ display: "flex", gap: "20px" }}
            sx={{
              "&:hover": {
                backgroundColor: "#E3EBFF",
              },
            }}
          >
            {text.icon}
            <ListItemText primary={text.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
