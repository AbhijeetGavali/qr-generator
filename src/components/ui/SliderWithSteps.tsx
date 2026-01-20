import { Slider } from "./slider";
import { cn } from "@/lib/utils";

interface SliderWithStepsProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  label?: string;
  unit?: string;
  boxed?: boolean;
}

export function SliderWithSteps({
  value,
  onChange,
  min,
  max,
  step,
  label,
  unit,
  boxed = false,
}: SliderWithStepsProps) {
  const steps = Array.from(
    { length: Math.floor((max - min) / step) + 1 },
    (_, i) => min + i * step,
  );

  return (
    <div
      className={
        "space-y-2" + (boxed ? " p-4 border border-gray-300 rounded-lg" : "")
      }
    >
      {label && (
        <div className="text-sm font-medium">
          {label}: {value}
          {unit}
        </div>
      )}

      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />

      {/* Step markers */}
      <div className="relative flex justify-between px-1">
        {steps.map((s) => {
          const isActive = s === value;
          const isPassed = s < value;

          return (
            <div key={s} className="flex flex-col items-center">
              <div
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  isActive
                    ? "bg-primary"
                    : isPassed
                      ? "bg-primary/60"
                      : "bg-muted",
                )}
              />
              <span className="mt-1 text-[10px] text-muted-foreground">
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
