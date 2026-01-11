import { FeaturePlan } from "@/types/feature";
import { motion } from "framer-motion";

const PLAN_COLORS: Record<FeaturePlan, string> = {
  free: "bg-green-500",
  pro: "bg-blue-600",
  enterprise: "bg-purple-600",
};

export default function FeatureCard({
  title,
  description,
  helpsWith,
  whenToUse,
  icon: Icon,
  plans,
}: {
  title: string;
  description: string;
  helpsWith: string;
  whenToUse: string;
  icon: any;
  plans: FeaturePlan[];
}) {
  const highestPlan = plans.includes("enterprise")
    ? "enterprise"
    : plans.includes("pro")
    ? "pro"
    : "free";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
    >
      {/* Tilted Badge */}
      <div
        className={`absolute top-4 -right-10 w-36 text-center text-xs font-semibold text-white py-1 rotate-45 transition-transform duration-300 group-hover:scale-110 ${PLAN_COLORS[highestPlan]}`}
      >
        {highestPlan.toUpperCase()}
      </div>

      {/* Icon */}
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-8 w-8 text-gray-800" />
      </div>

      {/* Title */}
      <h3 className="relative inline-block text-xl font-semibold mb-2">
        {title}
        <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gray-900 transition-all duration-300 group-hover:w-full" />
      </h3>

      <p className="text-gray-600 mb-4">{description}</p>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Helps you:</span> {helpsWith}
        </p>
        <p>
          <span className="font-medium">When you need it:</span> {whenToUse}
        </p>
      </div>
    </motion.div>
  );
}
