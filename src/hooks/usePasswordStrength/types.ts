export interface IUsePasswordStrengthActions {
  validationResult: IValidationRule[];
  score: number;
  entropy: number;
  validatePassword: (password: string) => boolean;
  password: string;
}

export interface IValidationRule {
  regex: RegExp;
  points: number;
  message: string;
  passed: boolean;
}

interface IValidationMessages {
  minLowercaseMessage?: string;
  minUppercaseMessage?: string;
  minSpecialCharMessage?: string;
  minNumberMessage?: string;
  minLengthMessage?: string;
}

export type IUsePasswordStrengthModes = "strict" | "regex" | "score";

export interface IUsePasswordStrengthParams {
  maxScore?: number;
  configMessages?: IValidationMessages;
  mode?: IUsePasswordStrengthModes;
  minBestEntropy?: number;
  minRequiredScore?: number;
}

export interface IValidatePasswordRulesResponse {
  points: number;
  result: IValidationRule[];
}
