import { getAuth, signOut } from "firebase/auth";
import { LogOut, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProfileMenu() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      {/* Profile Icon */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold"
      >
        {user.email?.[0]?.toUpperCase() ?? <User size={18} />}
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white shadow-lg z-50">
          <div className="px-3 py-2 text-xs text-gray-500 truncate">
            {user.email}
          </div>

          <div className="border-t" />

          <button
            onClick={() => (window.location.href = "/pricing")}
            className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100"
          >
            <Sparkles size={16} />
            Upgrade
          </button>

          <button
            onClick={logout}
            className="w-full px-3 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
