import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import { Link } from "wouter";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Hero Section */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm italic">
              Effective Date: February 3, 2026
            </p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
              <section>
                <p className="text-lg text-gray-600">
                  This Privacy Policy explains how <strong>Silicon Crew</strong>{" "}
                  (“we”, “our”, or “us”) handles your information when using our
                  QR Code Generator. This website is operated by Silicon Crew,
                  registered under the laws of India.
                </p>
              </section>

              <hr />

              <div>
                {/* Main Content Column */}
                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                      Information Collection
                    </h2>
                    <p>
                      We do not collect, store, or process any personal
                      information from users. All QR codes are generated locally
                      in your browser. We do not track, identify, or know how
                      users utilize the generated QR codes.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                      Cookies & Analytics
                    </h2>
                    <p>
                      We do not use cookies or analytics tools. However,
                      third-party advertising partners such as Google may use
                      cookies in accordance with their own privacy policies.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                      Advertisements
                    </h2>
                    <p className="mb-6">
                      This website may display advertisements through Google
                      AdSense or direct banner ads. Advertisers interested in
                      placing ads may contact us at{" "}
                      <strong>sicrewlimited@gmail.com</strong>.
                    </p>

                    {/* Enhanced Ad placeholder UI */}
                    <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-8 text-center transition-all hover:border-blue-400 group">
                      <p className="text-blue-800 font-medium mb-1">
                        Advertise with Silicon Crew
                      </p>
                      <p className="text-blue-600 text-sm mb-3">
                        Reach users generating QR codes daily.
                      </p>
                      <Link
                        href="/contact-sales"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                      Third-Party Links
                    </h2>
                    <p>
                      Our tool may generate QR codes linking to external
                      websites. We are not responsible for the content, privacy
                      practices, or safety of third-party sites.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                      Disclaimer
                    </h2>
                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg italic text-gray-600">
                      The service is provided “as is” without warranties of any
                      kind. Silicon Crew shall not be liable for any damages
                      arising from the use of this tool or generated QR codes.
                      The website may change or be unavailable at any time
                      without notice.
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                      Contact Support
                    </h2>
                    <div className="">
                      <div className="bg-white mb-2 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Company / Legal
                        </p>
                        <a
                          href="mailto:sicrewlimited@gmail.com"
                          className="text-blue-600 hover:underline break-words font-medium"
                        >
                          sicrewlimited@gmail.com
                        </a>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Lead Developer
                        </p>
                        <a
                          href="mailto:mr.abhijeetgavali@gmail.com"
                          className="text-blue-600 hover:underline break-words font-medium"
                        >
                          mr.abhijeetgavali@gmail.com
                        </a>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Sidebar Column */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
