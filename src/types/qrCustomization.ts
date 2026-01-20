// types/qrCustomization.ts
export type ColorMode = "single" | "gradient";

export interface GradientConfig {
  from: string;
  to: string;
  rotation: number;
}

export interface ColorConfig {
  mode: ColorMode;
  singleColor: string;
  gradient: GradientConfig;
}

export interface CustomizationValue {
  style: string;
  color: ColorConfig;
}
