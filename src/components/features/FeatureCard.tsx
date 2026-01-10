import { FeaturePlan } from "@/types/feature";

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
    <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Tilted Badge */}
      <div
        className={`absolute top-4 -right-10 w-36 text-center text-xs font-semibold text-white py-1 rotate-45 ${PLAN_COLORS[highestPlan]}`}
      >
        {highestPlan.toUpperCase()}
      </div>

      {/* Icon */}
      <div className="mb-4">
        <Icon className="h-8 w-8 text-gray-800" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      <p className="text-gray-600 mb-4">{description}</p>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Helps you:</span> {helpsWith}
        </p>
        <p>
          <span className="font-medium">When you need it:</span> {whenToUse}
        </p>
      </div>
    </div>
  );
}
