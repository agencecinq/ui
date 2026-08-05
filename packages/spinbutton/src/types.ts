export type FormatValue = (value: number) => string;

export interface Options {
  step: number;
  delay: number;
}

export interface Value {
  min: number | false;
  max: number | false;
  now: number;
}

export interface Detail {
  value: number;
}
