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

export type QRFrameType = "none" | "scan" | "watch" | "custom";

export interface QRFrameConfig {
  enabled: boolean;
  type: QRFrameType;
  text: string;
  icon: "scan" | "play" | "none";
  backgroundColor: CustomizationValue;
  borderColor: CustomizationValue;
  textColor: CustomizationValue;
}
