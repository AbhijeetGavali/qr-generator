import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/components/firebase";

export const createDynamicQR = async (payload: any) => {
  return addDoc(collection(db, "qrcodes"), {
    ...payload,
    scanCount: 0,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateDynamicQR = async (id: string, payload: any) => {
  return updateDoc(doc(db, "qrcodes", id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const disableDynamicQR = async (id: string) => {
  return updateDoc(doc(db, "qrcodes", id), {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
};
