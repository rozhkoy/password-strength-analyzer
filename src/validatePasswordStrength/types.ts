import { IValidationRule } from "../hooks/usePasswordStrength";

export interface IValidatePasswordStrengthResponse {
  validationResult: IValidationRule[];
  score: number;
  entropy: number;
  isValid: boolean;
  password: string;
}
