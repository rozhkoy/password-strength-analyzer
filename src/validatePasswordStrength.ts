import { IValidatePasswordStrengthOptions, IValidatePasswordStrengthResponse } from "./types";
import { calculateEntropy, calculatePasswordScore, validatePasswordRules } from "./utils";

const defaultMessages = {
  minLowercaseMessage: "At least 1 lowercase letter",
  minUppercaseMessage: "At least 1 uppercase letter",
  minSpecialCharMessage: "At least 1 special character",
  minNumberMessage: "At least 1 number",
  minLengthMessage: "At least 8 characters long",
};

export function validatePasswordStrength(
  password: string,
  { maxScore = 5, minBestEntropy = 80, minRequiredScore = 3, mode = "strict", configMessages }: IValidatePasswordStrengthOptions = {}
): IValidatePasswordStrengthResponse {
  const messages = { ...defaultMessages, ...configMessages };
  minRequiredScore = minRequiredScore > maxScore ? maxScore : minRequiredScore;
  minBestEntropy = minBestEntropy < 20 ? 20 : minBestEntropy;

  let validationResult = [
    { regex: /[a-z]/, points: 26, message: messages.minLowercaseMessage, passed: false },
    { regex: /[A-Z]/, points: 26, message: messages.minUppercaseMessage, passed: false },
    { regex: /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, points: 33, message: messages.minSpecialCharMessage, passed: false },
    { regex: /[0-9]/, points: 10, message: messages.minNumberMessage, passed: false },
    { regex: /.{8,}/, points: 1, message: messages.minLengthMessage, passed: false },
  ];

  let isValid = false;

  const { result, points } = validatePasswordRules(password, validationResult);
  validationResult = result;
  const entropy = calculateEntropy(points, password);
  const score = calculatePasswordScore(entropy, minBestEntropy, maxScore);

  if (mode === "strict") {
    isValid = score >= minRequiredScore && points === 96;
  } else if (mode === "regex") {
    isValid = points === 96;
  } else {
    isValid = score >= minRequiredScore;
  }

  return { validationResult, score, entropy, password, isValid };
}
