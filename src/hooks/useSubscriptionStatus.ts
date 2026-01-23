import { useState, useEffect } from "react";
import { db } from "@/components/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "./useAuth";

export function useSubscriptionStatus() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    // Query the collection for a document belonging to this user with SUCCESS status
    const q = query(
      collection(db, "subscriptions"),
      where("uid", "==", user.uid),
      where("status", "==", "success"),
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
  }, [user]);

  return { isActive, loading, status: isActive ? "SUCCESS" : "Waiting" };
}
