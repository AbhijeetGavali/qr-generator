"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ContactSalesPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const data = await fetch("/api/contact-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Thanks! Our sales team will reach out shortly.");
    } catch (err) {
      alert(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Contact Sales</h1>
          <p className="text-muted-foreground">
            Talk to our sales team about enterprise pricing, custom features,
            and large-scale deployments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border rounded-xl p-6 shadow-sm"
          >
            <Input name="name" placeholder="Full Name" required />

            <Input
              name="email"
              type="email"
              placeholder="Work Email"
              required
            />

            <Input name="company" placeholder="Company Name" />

            <Textarea
              name="message"
              placeholder="Tell us about your requirements"
              rows={5}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What you’ll get</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Custom pricing for large teams</li>
                <li>Dedicated onboarding support</li>
                <li>Custom integrations & SLAs</li>
                <li>Priority support</li>
              </ul>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Prefer email?
              </p>
              <p className="font-medium">sicrewlimited@gmail.com</p>
              <p className="font-medium">mr.abhijeetgavali@gmail.com</p>
            </div>

            {/* Optional Calendly */}
            <div className="border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Book a meeting
              </p>
              <a
                href="https://calendly.com/abhijeetgavali/qr-code-enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Schedule a call →
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
