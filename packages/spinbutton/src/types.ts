export interface Text {
  single: string;
  plural: string;
}

export interface Options {
  text?: Text;
  step: number;
  delay: number;
}

export interface Value {
  min: number | false;
  max: number | false;
  now: number;
  text: string;
}

export interface SpinbuttonChangeDetail {
  value: number;
}
