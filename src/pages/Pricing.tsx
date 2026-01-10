import FeatureSection from "@/components/features/FeatureSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PricingCard from "@/components/pricing/PricingCard";
import { PRICING_PLANS } from "@/config/pricing";
import React from "react";

export default function Pricing() {
  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Choose the perfect plan for your needs. Start free and scale as you
          grow.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="my-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
      </div>
      <FeatureSection />
      <Footer />
    </>
  );
}
