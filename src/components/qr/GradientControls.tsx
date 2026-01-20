import { GradientConfig } from "@/types/qrCustomization";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";

const rotations = [0, 45, 90, 135, 180, 225, 270, 315];

const quickGradients = [
  ["#ff4d4d", "#ff9800"],
  ["#facc15", "#fde047"],
  ["#22c55e", "#4ade80"],
  ["#06b6d4", "#3b82f6"],
  ["#6366f1", "#a855f7"],
  ["#ec4899", "#f43f5e"],
];

export default function GradientControls({
  value,
  onChange,
}: {
  value: GradientConfig;
  onChange: (v: GradientConfig) => void;
}) {
  return (
    <div className="space-y-4 border border-gray-300 rounded-lg p-4">
      {/* Colors */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex gap-2">
          <Input
            type="color"
            value={value.from}
            onChange={(e) =>
              onChange({
                ...value,
                from: e.target.value,
              })
            }
            className="w-12 h-9 p-1 cursor-pointer"
            data-testid="input-from-color"
          />
          <Input
            type="text"
            value={value.from}
            onChange={(e) =>
              onChange({
                ...value,
                from: e.target.value,
              })
            }
            className="flex-1 font-mono text-sm"
            data-testid="input-from-color-text"
          />
        </div>
        <div className="flex gap-2">
          <Input
            type="color"
            value={value.to}
            onChange={(e) =>
              onChange({
                ...value,
                to: e.target.value,
              })
            }
            className="w-12 h-9 p-1 cursor-pointer"
            data-testid="input-to-color"
          />
          <Input
            type="text"
            value={value.to}
            onChange={(e) =>
              onChange({
                ...value,
                to: e.target.value,
              })
            }
            className="flex-1 font-mono text-sm"
            data-testid="input-to-color-text"
          />
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <Label>Gradient Rotation</Label>
        <Tabs
          value={`${value.rotation}`}
          onValueChange={(v) => onChange({ ...value, rotation: parseInt(v) })}
        >
          <TabsList className={`grid grid-cols-8 mt-3`}>
            {rotations.map((r) => (
              <TabsTrigger value={`${r}`}>{r}°</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Quick gradients */}
      <div className="space-y-2">
        <Label>Quick Gradients</Label>
        <div className="grid grid-cols-6 gap-2 flex-wrap">
          {quickGradients.map(([from, to]) => (
            <button
              key={from + to}
              onClick={() => onChange({ ...value, from, to })}
              className="h-6 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${from}, ${to})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
