import { Button } from "@/components/ui/button";
import FeatureItem from "./FeatureItem";
import { motion } from "framer-motion";

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
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h2 className="text-2xl text-center font-bold mb-4">{title}</h2>

      <p className="text-4xl text-center font-extrabold mb-6">
        {price}
        {duration && (
          <span className="text-base font-medium text-gray-500 ml-2">
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
    </motion.div>
  );
}
