import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

        <p className="mb-4">
          Welcome to the QR Code Generator website, operated by{" "}
          <strong>Silicon Crew</strong>, registered under the laws of India. By
          using this website, you agree to the following terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Use of Service</h2>
        <p className="mb-4">
          This website provides a tool to generate QR codes. Users are solely
          responsible for the use of generated QR codes. You agree not to use
          this tool for illegal, harmful, or malicious purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          No User Data Collected
        </h2>
        <p className="mb-4">
          We do not collect, store, or process any personal information. All QR
          codes are generated locally in your browser.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Advertisements</h2>
        <p className="mb-4">
          This website may display advertisements through Google AdSense or
          direct banner ads. Interested advertisers should contact us at{" "}
          <strong>sicrewlimited@gmail.com</strong>.
        </p>

        {/* Ad placeholder UI */}
        <div className="border-2 border-dashed border-gray-400 p-6 text-center mb-6">
          <p className="text-gray-600">
            Advertise here → contact <strong>sicrewlimited@gmail.com</strong>
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          Disclaimer & Liability
        </h2>
        <p className="mb-4">
          The service is provided “as is” without warranties of any kind.
          Silicon Crew shall not be liable for any damages, misuse of QR codes,
          or interruptions in service. The website may change or be unavailable
          at any time without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Changes to Terms</h2>
        <p className="mb-4">
          We may update these terms at any time. Continued use of the website
          constitutes acceptance of any updated terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="mb-4">
          For any questions, support, or advertising inquiries, please contact:
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
      <Footer />
    </>
  );
};

export default TermsOfService;
