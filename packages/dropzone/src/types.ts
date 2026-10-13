/** Why a file was left out of the input. */
export type Reason = "accept" | "size" | "multiple";

export type Rejection = {
  file: File;
  reason: Reason;
};

/** `dropzone:change` detail. */
export type ChangeDetail = {
  /** Files now held by the input, empty after a clear. */
  files: File[];
  $input: HTMLInputElement;
};

/** `dropzone:reject` detail. */
export type RejectDetail = {
  rejected: Rejection[];
  $input: HTMLInputElement;
};
