import type { Rejection } from "./types.js";

export type Rules = {
  /** The input's `accept`: extensions (`.svg`), MIME types (`image/png`) or groups (`image/*`). */
  accept: string;
  /** Largest file in bytes, `0` for no limit. */
  maxSize: number;
  multiple: boolean;
};

/** Whether a file matches an `accept` attribute, as the native picker reads it. */
export function accepts(file: File, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (!tokens.length) {
    return true;
  }

  return tokens.some((token) => {
    if (token.startsWith(".")) {
      return name.endsWith(token);
    }

    if (token.endsWith("/*")) {
      return type.startsWith(token.slice(0, -1));
    }

    return type === token;
  });
}

/** Splits files into the ones the input keeps and the ones it leaves out. */
export function filter(
  files: File[],
  { accept, maxSize, multiple }: Rules,
): { accepted: File[]; rejected: Rejection[] } {
  const accepted: File[] = [];
  const rejected: Rejection[] = [];

  files.forEach((file) => {
    if (!accepts(file, accept)) {
      rejected.push({ file, reason: "accept" });
      return;
    }

    if (maxSize && file.size > maxSize) {
      rejected.push({ file, reason: "size" });
      return;
    }

    if (!multiple && accepted.length) {
      rejected.push({ file, reason: "multiple" });
      return;
    }

    accepted.push(file);
  });

  return { accepted, rejected };
}
