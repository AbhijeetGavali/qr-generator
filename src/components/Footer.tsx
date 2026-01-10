import { QrCode } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/" data-testid="home-link">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              <span className="font-semibold">QRGen</span>
            </div>
          </a>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
            <a
              href="/privacy-policy"
              className="hover:text-foreground transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-foreground transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </a>
            <a
              href="/contact"
              className="hover:text-foreground transition-colors"
              data-testid="link-contact"
            >
              Contact
            </a>
          </div>
          <p
            className="text-sm text-muted-foreground"
            data-testid="text-copyright"
          >
            {new Date().getFullYear()} QRGen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
