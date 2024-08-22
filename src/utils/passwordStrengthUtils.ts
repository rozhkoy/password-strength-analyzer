import { IValidatePasswordRulesResponse, IValidationRule } from "../types";

export function calculateEntropy(points: number, password: string): number {
  if (!points || !password) return 0;
  const passwordLength = new Set(password).size;
  return passwordLength * Math.log2(points);
}

export function calculatePasswordScore(entropy: number, minBestEntropy: number, maxScore: number): number {
  if (entropy == 0) return 0;
  return Math.min(Math.floor(entropy / (minBestEntropy / (maxScore - 1))) + 1, maxScore);
}

export function validatePasswordRules(password: string, rules: IValidationRule[]): IValidatePasswordRulesResponse {
  let points = 0;
  const result = rules.map((rule) => {
    if (rule.regex.test(password)) {
      rule.passed = true;
      points += rule.points;
    } else {
      rule.passed = false;
    }
    return rule;
  });

  return { points, result };
}
