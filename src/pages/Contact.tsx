import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

const Contact: React.FC = () => {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
};

export default Contact;
