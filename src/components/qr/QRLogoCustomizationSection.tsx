import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { SliderWithSteps } from "../ui/SliderWithSteps";

interface Props {
  logoFile: File | null;
  onLogoChange: (file: File | null) => void;

  minLogoSize: number;
  maxLogoSize: number;
  unit: string;
  step: number;
  logoSize: number;
  onLogoSizeChange: (v: number) => void;

  logoShape: "square" | "rounded" | "circle";
  onLogoShapeChange: (v: "square" | "rounded" | "circle") => void;
}

export function QRLogoCustomizationSection({
  logoFile,
  onLogoChange,
  minLogoSize,
  maxLogoSize,
  unit,
  step,
  logoSize,
  onLogoSizeChange,
  logoShape,
  onLogoShapeChange,
}: Props) {
  return (
    <div className="space-y-4 my-4 border border-gray-300 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        Add Logo
      </div>

      {/* Logo Shape */}
      {/* <div className="space-y-2">
        <Label className="text-sm">Logo Shape</Label>
        <select
          value={logoShape}
          onChange={(e) => onLogoShapeChange(e.target.value as any)}
          className="w-full rounded-lg px-3 py-2 outline-none border border-gray-300 text-sm"
        >
          {["square", "rounded", "circle"].map((s) => (
            <option key={s} value={s}>
              {s.replace(/^\w/, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div> */}

      {/* Logo Upload */}
      <div className="space-y-2 mb-2">
        <Label className="text-sm">Logo Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onLogoChange(e.target.files?.[0] || null)}
          className="w-full rounded-lg px-3 py-2 outline-none border border-gray-300 text-sm"
        />
        {logoFile && (
          <p className="text-xs text-muted-foreground truncate">
            {logoFile.name}
          </p>
        )}
      </div>

      {/* Logo Size */}

      <SliderWithSteps
        label="Logo Size"
        value={logoSize}
        min={minLogoSize}
        max={maxLogoSize}
        step={step}
        unit={unit}
        onChange={onLogoSizeChange}
      />
      <p className="text-xs text-muted-foreground">
        Max logo size: {maxLogoSize}px (30% of QR)
      </p>
    </div>
  );
}
