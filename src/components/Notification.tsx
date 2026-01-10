// src/components/NotificationIcon.tsx
import { Bell } from "lucide-react";

export default function NotificationIcon() {
  return (
    <button className="relative">
      <Bell size={22} />
      {/* Badge (optional) */}
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
    </button>
  );
}
