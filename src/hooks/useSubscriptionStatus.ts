import { useState, useEffect } from "react";
import { db } from "@/components/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function useSubscriptionStatus(uid: string | undefined) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    // Query the collection for a document belonging to this user with SUCCESS status
    const q = query(
      collection(db, "subscriptions"),
      where("uid", "==", uid),
      where("status", "==", "SUCCESS"),
      where("isActive", "==", "true"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // If any document exists matching these criteria, they are active
        setIsActive(!snapshot.empty);
        setLoading(false);
      },
      (error) => {
        console.error("Subscription check failed:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [uid]);

  return { isActive, loading, status: isActive ? "SUCCESS" : "Waiting" };
}
