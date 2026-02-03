import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Scale,
  AlertCircle,
  CreditCard,
  Gavel,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Terms and Conditions</h1>
          <p className="text-slate-500">
            Last updated on
            <span className="font-semibold text-slate-700 ml-2">
              03-02-2026
            </span>
          </p>
        </div>

        <div className="space-y-8 bg-white p-8 md:p-12 shadow-sm border border-slate-200 rounded-2xl">
          {/* 1. Introductory Section */}
          <section className="prose prose-slate max-w-none">
            <p className="leading-relaxed">
              These Terms and Conditions, along with the privacy policy
              (“Terms”), constitute a binding agreement by and between
              <span className="font-bold text-blue-700 mx-2">
                ABHIJEET BALASAHEB GAVALI
              </span>
              (“Website Owner”, “we”, “us”, or “our”) and you (“you” or “your”)
              regarding your use of the QR Code Generator website and its
              services.
            </p>
            <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 text-sm">
              By using our website, you agree that you have read and accepted
              these Terms. We reserve the right to modify these Terms at any
              time without prior notice.
            </p>
          </section>

          {/* 2. User Responsibilities */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-800">
              <UserCheck className="text-blue-600 w-5 h-5" /> User
              Responsibilities
            </h2>
            <ul className="grid text-slate-600 list-none p-0">
              <li className="flex gap-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  You agree to provide true, accurate, and complete information
                  during and after registration.
                </span>
              </li>
              <li className="flex gap-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  You are responsible for all acts performed through your
                  registered account.
                </span>
              </li>
              <li className="flex gap-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  You agree not to use the services for any unlawful or
                  forbidden purpose under Indian or local laws.
                </span>
              </li>
            </ul>
          </section>

          {/* 3. Liability & Disclaimers */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-800">
              <AlertCircle className="text-red-500 w-5 h-5" /> Disclaimer &
              Liability
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Neither we nor any third parties provide any warranty as to the
                accuracy, performance, or suitability of the information
                offered. We expressly exclude liability for inaccuracies or
                errors to the fullest extent permitted by law.
              </p>
              <p>
                Your use of our Services is
                <strong className="ml-2">solely at your own risk</strong>. You
                are required to independently assess and ensure the Services
                meet your requirements.
              </p>
            </div>
          </section>

          {/* 4. Payments & Refunds */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-800">
              <CreditCard className="text-green-600 w-5 h-5" /> Payments &
              Refund Policy
            </h2>
            <p className="text-slate-600 mb-4">
              By initiating a transaction, you enter into a legally binding
              contract with us.
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200 text-sm">
              <p>
                Unless otherwise specified for a particular service, all
                transactions are final. There are no refunds or returns provided
                for the services availed on this website.
              </p>
            </div>
          </section>

          {/* 5. Intellectual Property & Third Parties */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-800">
              <ShieldCheck className="text-purple-600 w-5 h-5" /> Proprietary
              Rights
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              The contents of this Website are proprietary to Us. You do not
              have authority to claim any intellectual property rights, title,
              or interest in its contents. Unauthorized use may lead to legal
              action.
            </p>
            <div className="flex items-start gap-2 text-sm italic text-slate-500">
              <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0" />
              <p>
                This service may contain links to third-party websites. Once you
                leave our site, you are governed by their specific terms and
                policies.
              </p>
            </div>
          </section>

          {/* 6. Jurisdiction & Force Majeure */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-800">
              <Gavel className="text-slate-700 w-5 h-5" /> Governing Law
            </h2>
            <p className="text-slate-600 mb-4">
              These Terms shall be governed by the laws of
              <strong className="ml-1">India</strong>. All disputes are subject
              to the exclusive jurisdiction of the courts in{" "}
              <strong>Pune, Maharashtra</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Force Majeure: Neither party shall be liable for failure to
              perform obligations if prevented by events beyond reasonable
              control.
            </p>
          </section>


          {/* Final Contact Footer */}
          <div className="text-center pt-8 text-sm text-slate-500">
            <p>Questions about these terms? Reach us at:</p>
            <p className="font-semibold text-slate-800">
              sicrewlimited@gmail.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
