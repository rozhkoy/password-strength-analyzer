import { IValidationMessages, IValidationRule } from "../hooks/usePasswordStrength";

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
