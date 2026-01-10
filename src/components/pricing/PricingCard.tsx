import { Button } from "@/components/ui/button";
import FeatureItem from "./FeatureItem";

interface PricingCardProps {
  title: string;
  price: string;
  duration?: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
}

export default function PricingCard({
  title,
  price,
  duration,
  features,
  ctaLabel,
  ctaLink,
}: PricingCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col">
      <h2 className="text-2xl text-center font-bold mb-4">{title}</h2>

      <p className="text-4xl text-center font-extrabold mb-6">
        {price}
        {duration && (
          <span className="text-base font-medium text-gray-500">
            {duration}
          </span>
        )}
      </p>

      <ul className="mb-6 space-y-4 flex-1">
        {features.map((feature, idx) => (
          <FeatureItem key={idx} label={feature} />
        ))}
      </ul>

      <a href={ctaLink}>
        <Button className="min-w-full">{ctaLabel}</Button>
      </a>
    </div>
  );
}
