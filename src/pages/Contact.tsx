import { QrCode } from "lucide-react";
import React from "react";

const Contact: React.FC = () => {
  return (
    <>
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
        </div>
      </header>
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

        <p className="mb-4">
          We’d love to hear from you! For any inquiries, support, or advertising
          opportunities, please reach out via the following emails:
        </p>

        <ul className="list-disc ml-6 mb-6">
          <li>
            Company/Legal & Advertising:{" "}
            <strong>sicrewlimited@gmail.com</strong>
          </li>
          <li>
            Developer / Technical Support:{" "}
            <strong>mr.abhijeetgavali@gmail.com</strong>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          Advertising Opportunities
        </h2>
        <p className="mb-4">
          We have dedicated spaces on this website for advertisements. If you
          are interested in placing an ad, please contact us at{" "}
          <strong>sicrewlimited@gmail.com</strong>.
        </p>

        {/* Ad placeholder UI */}
        <div className="border-2 border-dashed border-gray-400 p-6 text-center mb-6">
          <p className="text-gray-600">
            Advertise here → contact <strong>sicrewlimited@gmail.com</strong>
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Feedback & Support</h2>
        <p className="mb-4">
          For technical issues or feedback related to the QR code generator,
          contact the developer at
          <strong> mr.abhijeetgavali@gmail.com</strong>.
        </p>
      </div>
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
    </>
  );
};

export default Contact;
