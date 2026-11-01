import type { CSSProperties, JSX, ReactNode, RefObject } from "react";

export interface GlassSurfaceProps {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  shape?: string;
  refraction?: boolean;
  renderer?: "auto" | "svg" | "webgl";
  backdrop?: RefObject<HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | null>;
  distortionScale?: number;
  borderWidth?: number;
  blur?: number;
  brightness?: number;
  opacity?: number;
  displace?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  backgroundOpacity?: number;
  saturation?: number;
  xChannel?: "R" | "G" | "B";
  yChannel?: "R" | "G" | "B";
  mixBlendMode?: CSSProperties["mixBlendMode"];
  className?: string;
  style?: CSSProperties;
}

declare const GlassSurface: (props: GlassSurfaceProps) => JSX.Element;
export default GlassSurface;
