import { CircularProgress, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

export const PaymentLoader = ({ message = "Securing your connection..." }) => (
  <Box className="min-h-screen flex flex-col items-center justify-center bg-white">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer pulse effect */}
        <div className="absolute inset-0 rounded-full bg-blue-50 animate-ping opacity-75" />
        <CircularProgress size={80} thickness={2} sx={{ color: "#0ea5e9" }} />
      </div>

      <Typography
        variant="h6"
        className="text-slate-600 font-medium animate-pulse"
      >
        {message}
      </Typography>
      <Typography variant="body2" className="text-slate-400 mt-2">
        Please do not refresh or close this window.
      </Typography>
    </motion.div>
  </Box>
);
