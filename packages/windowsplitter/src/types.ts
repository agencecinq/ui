export type Orientation = "horizontal" | "vertical";
export type Mode = "resize" | "clip" | "none";

export type SizeContext = {
  value: number;
  ratio: number;
  offset: number;
  length: number;
};

export type FormatSize = (context: SizeContext) => string;
export type FormatValue = (value: number) => string;

export type WindowSplitterDetail = {
  value: number;
  min: number;
  max: number;
  ratio: number;
  collapsed: boolean;
};
