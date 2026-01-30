import { QRFrameConfig } from "@/types/qrCustomization";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { QRCustomizationSection } from "./QRCustomizationSection";

export function QRFrameSection({
  value,
  onChange,
}: {
  value: QRFrameConfig;
  onChange: (v: QRFrameConfig) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="p-4 space-y-4">
        <div>
          <Label className="text-xs">Preset</Label>
          {/* TODO: we need to add preview of the frame as a tab */}
          <select
            value={value.type}
            onChange={(e) =>
              onChange({ ...value, type: e.target.value as any })
            }
            className="w-full mt-1 rounded-lg border px-3 py-2 text-sm"
          >
            <option value="none">None</option>
            <option value="scan">Scan Me</option>
            <option value="watch">Watch Now</option>
          </select>
        </div>

        {/* CTA Text */}
        {value.type !== "none" && (
          <div>
            <Label className="text-xs">CTA Text</Label>
            <Input
              value={value.text}
              onChange={(e) => onChange({ ...value, text: e.target.value })}
              placeholder="SCAN ME"
            />
          </div>
        )}

        {/* Icon */}
        {value.type !== "none" && (
          <div>
            <Label className="text-xs">Icon</Label>
            <Tabs
              value={value.icon}
              onValueChange={(v) => onChange({ ...value, icon: v as any })}
            >
              <TabsList className="grid grid-cols-10">
                {/* need to add 10-20 icons */}
                <TabsTrigger value="scan">Scan</TabsTrigger>
                <TabsTrigger value="play">Play</TabsTrigger>
                <TabsTrigger value="none">None</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Colors */}

        {value.type !== "none" && (
          <QRCustomizationSection
            title="Border Color"
            value={value.borderColor}
            onChange={(e) => onChange({ ...value, borderColor: e })}
          />
        )}
        {value.type !== "none" && (
          <QRCustomizationSection
            title="Text Background Color"
            value={value.backgroundColor}
            onChange={(e) => onChange({ ...value, backgroundColor: e })}
          />
        )}
        {value.type !== "none" && (
          <QRCustomizationSection
            title="Text Color"
            value={value.textColor}
            onChange={(e) => onChange({ ...value, textColor: e })}
          />
        )}
      </div>
    </div>
  );
}
