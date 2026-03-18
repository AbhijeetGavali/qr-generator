import { Timestamp } from "firebase/firestore";

export type QrPrimaryType = "static" | "dynamic";

export type QrAnalytics = {
  dailyScans?: Record<string, number>;
  devices?: Record<string, number>;
  browsers?: Record<string, number>;
  referrers?: Record<string, number>;
};

export type QrCodeDoc = {
  qrId: string;
  ownerId: string;
  name?: string;
  primaryType?: QrPrimaryType;
  qrType?: string;
  payload?: string;
  redirectUrl?: string;
  isActive?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;
  scanCount?: number;
  lastScanned?: Timestamp;
  analytics?: QrAnalytics;
};

