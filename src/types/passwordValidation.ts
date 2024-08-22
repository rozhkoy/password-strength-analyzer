export interface IValidatePasswordStrengthResponse {
  validationResult: IValidationRule[];
  score: number;
  entropy: number;
  isValid: boolean;
  password: string;
}

export type IValidatePasswordStrengthModes = "strict" | "regex" | "score";

export interface IValidatePasswordStrengthOptions {
  maxScore?: number;
  configMessages?: IValidationMessages;
  mode?: IValidatePasswordStrengthModes;
  minBestEntropy?: number;
  minRequiredScore?: number;
}

export interface IValidationRule {
  regex: RegExp;
  points: number;
  message: string;
  passed: boolean;
}

export interface IValidationMessages {
  minLowercaseMessage?: string;
  minUppercaseMessage?: string;
  minSpecialCharMessage?: string;
  minNumberMessage?: string;
  minLengthMessage?: string;
}

export interface IValidatePasswordRulesResponse {
  points: number;
  result: IValidationRule[];
}
