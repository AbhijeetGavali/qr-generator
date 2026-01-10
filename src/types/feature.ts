import { LucideIcon } from "lucide-react";

export type FeaturePlan = "free" | "pro" | "enterprise";

export interface FeatureCard {
  title: string;
  description: string;
  helpsWith: string;
  whenToUse: string;
  icon: LucideIcon;
  plans: FeaturePlan[];
}
