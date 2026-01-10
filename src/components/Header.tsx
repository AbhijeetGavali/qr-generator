import { QrCode } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import VerifyEmailBanner from "./VerifyEmailBanner";
import NotificationIcon from "./Notification";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  return (
    <>
      <VerifyEmailBanner />
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <a href="/" data-testid="home-link">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold" data-testid="text-brand">
                QRGen
              </span>
            </div>
          </a>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationIcon />
                <ProfileMenu />
              </>
            ) : (
              <>
                <a href="/pricing" data-testid="home-link">
                  <div className="flex items-center gap-2">Pricing</div>
                </a>
                <a href="/login" data-testid="login-link">
                  <Button className="min-w-[140px]" data-testid="button-login">
                    Login
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
