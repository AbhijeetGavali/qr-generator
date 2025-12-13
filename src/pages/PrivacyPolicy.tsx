import { QrCode } from "lucide-react";
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold" data-testid="text-brand">
              QRGen
            </span>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <p className="mb-4">
          This Privacy Policy explains how <strong>Silicon Crew</strong> (“we”,
          “our”, or “us”) handles your information when using our QR Code
          Generator. This website is operated by Silicon Crew, registered under
          the laws of India.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          Information Collection
        </h2>
        <p className="mb-4">
          We do not collect, store, or process any personal information from
          users. All QR codes are generated locally in your browser. We do not
          track, identify, or know how users utilize the generated QR codes.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          Cookies & Analytics
        </h2>
        <p className="mb-4">
          We do not use cookies or analytics tools. However, third-party
          advertising partners such as Google may use cookies in accordance with
          their own privacy policies.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Advertisements</h2>
        <p className="mb-4">
          This website may display advertisements through Google AdSense or
          direct banner ads. Advertisers interested in placing ads may contact
          us at <strong>sicrewlimited@gmail.com</strong>.
        </p>

        {/* Ad placeholder UI */}
        <div className="border-2 border-dashed border-gray-400 p-6 text-center mb-6">
          <p className="text-gray-600">
            Advertise here → contact <strong>sicrewlimited@gmail.com</strong>
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Links</h2>
        <p className="mb-4">
          Our tool may generate QR codes linking to external websites. We are
          not responsible for the content, privacy practices, or safety of
          third-party sites.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Disclaimer</h2>
        <p className="mb-4">
          The service is provided “as is” without warranties of any kind.
          Silicon Crew shall not be liable for any damages arising from the use
          of this tool or generated QR codes. The website may change or be
          unavailable at any time without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p className="mb-4">
          For any questions, support, or advertising inquiries, please contact
          us at:
        </p>
        <ul className="list-disc ml-6">
          <li>
            Company/Legal: <strong>sicrewlimited@gmail.com</strong>
          </li>
          <li>
            Developer: <strong>mr.abhijeetgavali@gmail.com</strong>
          </li>
        </ul>
      </div>
      <footer className="border-t border-border py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              <span className="font-semibold">QRGen</span>
            </div>
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

export default PrivacyPolicy;
