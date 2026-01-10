import FeatureCard from "./FeatureCard";
import { FEATURE_CARDS } from "@/config/features";

export default function FeatureSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Powerful Features That Scale With You
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Everything you need to create, manage, track, and optimize QR codes—
          from simple use cases to enterprise workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURE_CARDS.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
