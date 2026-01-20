import { CustomizationValue } from "@/types/qrCustomization";
import { useState } from "react";
import { Input } from "../ui/input";
import GradientControls from "./GradientControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Props {
  title: string;
  icon?: React.ReactNode;
  styles?: { label: string; value: string }[];
  value: CustomizationValue;
  onChange: (value: CustomizationValue) => void;
}

export function QRCustomizationSection({
  title,
  icon,
  styles,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-xl my-4 border border-gray-300 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>

      {/* Style dropdown */}
      {styles && (
        <select
          value={value.style}
          onChange={(e) => onChange({ ...value, style: e.target.value })}
          className="w-full rounded-lg px-3 py-2 outline-none border border-gray-300 text-sm"
        >
          {styles.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      )}

      {/* Color mode tabs */}
      <Tabs
        value={value.color.mode}
        onValueChange={(v) =>
          onChange({ ...value, color: { ...value.color, mode: v as any } })
        }
        id={title + "-color-mode-tabs"}
      >
        <TabsList className="grid grid-cols-2 mt-3">
          <TabsTrigger value="single">Single Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
        </TabsList>

        {/* Color picker */}
        <TabsContent value="single" className="space-y-6">
          <div className="flex gap-2">
            <Input
              type="color"
              value={value.color.singleColor}
              onChange={(e) =>
                onChange({
                  ...value,
                  color: { ...value.color, singleColor: e.target.value },
                })
              }
              className="w-12 h-9 p-1 cursor-pointer"
              data-testid="input-single-color"
            />
            <Input
              type="text"
              value={value.color.singleColor}
              onChange={(e) =>
                onChange({
                  ...value,
                  color: { ...value.color, singleColor: e.target.value },
                })
              }
              className="flex-1 font-mono text-sm"
              data-testid="input-single-color"
            />
          </div>
        </TabsContent>
        <TabsContent value="gradient" className="space-y-6">
          <GradientControls
            value={value.color.gradient}
            onChange={(gradient) =>
              onChange({
                ...value,
                color: { ...value.color, gradient },
              })
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
