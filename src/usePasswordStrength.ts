import { useCallback, useMemo, useState } from "react";
import { IUsePasswordStrengthActions, IUsePasswordStrengthParams, IValidationRule } from "./types";
import { calculateEntropy, calculatePasswordScore, validatePasswordRules } from "./utils";

const defaultMessages = {
  minLowercaseMessage: "At least 1 lowercase letter",
  minUppercaseMessage: "At least 1 uppercase letter",
  minSpecialCharMessage: "At least 1 special character",
  minNumberMessage: "At least 1 number",
  minLengthMessage: "At least 8 characters long",
};

export function usePasswordStrength({ maxScore = 5, minBestEntropy = 80, minRequiredScore = 3, mode = "strict", configMessages }: IUsePasswordStrengthParams = {}): IUsePasswordStrengthActions {
  const messages = { ...defaultMessages, ...configMessages };
  minRequiredScore = minRequiredScore > maxScore ? maxScore : minRequiredScore;
  minBestEntropy = minBestEntropy < 20 ? 20 : minBestEntropy;

  const [validationResult, setValidationResult] = useState<Array<IValidationRule>>([
    { regex: /[a-z]/, points: 26, message: messages.minLowercaseMessage, passed: false },
    { regex: /[A-Z]/, points: 26, message: messages.minUppercaseMessage, passed: false },
    { regex: /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, points: 33, message: messages.minSpecialCharMessage, passed: false },
    { regex: /[0-9]/, points: 10, message: messages.minNumberMessage, passed: false },
    { regex: /.{8,}/, points: 1, message: messages.minLengthMessage, passed: false },
  ]);

  const [password, setPassword] = useState<string>("");

  const getPoints = useCallback(
    (password: string) => {
      setPassword(password);
      const { result, points } = validatePasswordRules(password, validationResult);
      setValidationResult(result);
      return points;
    },
    [validationResult]
  );

  const getEntropy = useCallback((points: number, password: string) => {
    return calculateEntropy(points, password);
  }, []);

  const getPasswordScore = useCallback(
    (entropy: number) => {
      return calculatePasswordScore(entropy, minBestEntropy, maxScore);
    },
    [maxScore, minBestEntropy]
  );

  const points = useMemo(() => getPoints(password), [password]);
  const entropy = useMemo(() => getEntropy(points, password), [points, password]);
  const score = useMemo(() => getPasswordScore(entropy), [entropy]);

  function validatePassword(password: string) {
    const points = getPoints(password);
    const entropy = getEntropy(points, password);
    const score = getPasswordScore(entropy);

    if (mode === "strict") {
      return score >= minRequiredScore && points === 96;
    } else if (mode === "regex") {
      return points === 96;
    }
    return score >= minRequiredScore;
  }

  return { validationResult, score, entropy, validatePassword, password };
}
