import { CircleCheck } from "lucide-react";

export default function FeatureItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2">
      <CircleCheck color="#00eb1b" size={18} />
      <p>{label}</p>
    </li>
  );
}
