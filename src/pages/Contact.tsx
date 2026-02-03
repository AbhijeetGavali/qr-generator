import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ExternalLink, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import React from "react";
import { Link } from "wouter";

const Contact: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Have a question or want to partner with us? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Card 1: Advertising */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                <ExternalLink size={24} />
              </div>
              <h2 className="text-xl font-bold mb-2">Advertising & Legal</h2>
              <p className="text-gray-600 mb-4 text-sm">
                For brand partnerships, media inquiries, or legal concerns.
              </p>
              <a
                href="mailto:sicrewlimited@gmail.com"
                className="text-blue-600 font-semibold hover:underline"
              >
                sicrewlimited@gmail.com
              </a>
            </div>

            {/* Card 2: Tech Support */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-bold mb-2">Technical Support</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Need help with the QR generator or found a bug? Reach out to our
                dev.
              </p>
              <a
                href="mailto:mr.abhijeetgavali@gmail.com"
                className="text-blue-600 font-semibold hover:underline"
              >
                mr.abhijeetgavali@gmail.com
              </a>
            </div>
          </div>

          {/* Ad Placeholder Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-center text-white mb-12">
            <h3 className="text-lg font-medium opacity-90">
              Grow your brand with us
            </h3>
            <p className="text-2xl font-bold my-2">
              Premium Ad Spaces Available
            </p>
            <Link href="/contact-sales">
              <button className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
                Book Now
              </button>
            </Link>
          </div>

          {/* Footer Legal Details */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 transition-all shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Registered Business Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Entity & Contact */}
              <div className="md:col-span-1 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    Entity Name
                  </span>
                  <p className="text-gray-900 font-semibold text-base leading-tight">
                    Abhijeet Balasaheb Gavali
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <a
                    href="mailto:mr.abhijeetgavali@gmail.com"
                    className="group flex items-center gap-4 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <Mail
                        className="text-gray-400 group-hover:text-blue-500"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Email
                      </p>
                      <p className="text-sm font-medium">
                        mr.abhijeetgavali@gmail.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+917517990047"
                    className="group flex items-center gap-4 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <Phone
                        className="text-gray-400 group-hover:text-blue-500"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Telephone
                      </p>
                      <p className="text-sm font-medium">+91 7517990047</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Address Section */}
              <div className="md:col-span-2 bg-gray-50/50 rounded-2xl p-6 border border-gray-100/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <MapPin className="text-blue-500" size={20} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      Registered Office
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                      Sr No. 31/6 1st FLR FLT no. 101, Vighnaharta Heights,
                      <br />
                      Near Prabhat Press, Abhinav College Road, Pune,
                      <br />
                      Maharashtra,{" "}
                      <span className="text-gray-900 font-bold">
                        PIN: 411058
                      </span>
                    </p>
                    <div className="pt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        India
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between">
            <span>Last updated: Feb 03, 2026</span>
            <span>Ref: 131239</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
