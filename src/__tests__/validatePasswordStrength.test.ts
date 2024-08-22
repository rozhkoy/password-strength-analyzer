import { describe, expect, it } from "vitest";
import { validatePasswordStrength } from "../validatePasswordStrength";

describe("ValidatePasswordStrength", () => {
  it("validates given password by rules with default options", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 3;

    const { isValid, score, entropy, validationResult } = validatePasswordStrength(password);

    expect(isValid).toBe(true);
    expect(entropy).toBe(expectedEntropy);
    expect(score).toBe(expectedScore);
    validationResult.forEach((rule) => expect(rule.passed).toBe(true));
  });

  it("adjusts score based on custom entropy and score settings", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 7;

    const { isValid, score, entropy, validationResult } = validatePasswordStrength(password, {
      maxScore: 10,
      minBestEntropy: 100,
      minRequiredScore: 7,
    });

    expect(isValid).toBe(false);
    expect(entropy).toBe(expectedEntropy);
    expect(score).toBeLessThan(expectedScore);
    validationResult.forEach((rule) => expect(rule.passed).toBe(true));
  });

  it("validates given password by rules with minBestEntropy 100", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 3;

    const { isValid, score, entropy, validationResult } = validatePasswordStrength(password, {
      minBestEntropy: 100,
    });

    expect(isValid).toBe(true);
    expect(entropy).toBe(expectedEntropy);
    expect(score).toBe(expectedScore);
    validationResult.forEach((rule) => expect(rule.passed).toBe(true));
  });

  it("validates given password by rules with score mode", () => {
    const password = "QAWSEDRFtgyhuj";
    const expectedEntropy = 80.19088636388479;
    const expectedScore = 5;
    const { isValid, score, entropy } = validatePasswordStrength(password, {
      mode: "score",
      minRequiredScore: 3,
    });

    expect(isValid).toBe(true);
    expect(entropy).toBe(expectedEntropy);
    expect(score).toBe(expectedScore);
  });

  it("validates given password with insufficient score", () => {
    const password = "ZAQ!1q";
    const expectedEntropy = 39.41913364998569;
    const expectedScore = 5;
    const { isValid, score, entropy } = validatePasswordStrength(password, {
      mode: "score",
      minRequiredScore: 3,
    });

    expect(isValid).toBe(false);
    expect(entropy).toBe(expectedEntropy);
    expect(score).toBeLessThan(expectedScore);
  });

  it("validates given password by rules with regex mode", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 3;

    const { isValid, score, entropy, validationResult } = validatePasswordStrength(password, {
      mode: "regex",
      minRequiredScore: 4,
    });

    expect(isValid).toBe(true);
    expect(entropy).toBe(expectedEntropy);
    expect(score).toBe(expectedScore);
    validationResult.forEach((rule) => expect(rule.passed).toBe(true));
  });

  it("fails validation for password that does not meet required score", () => {
    const password = "QADRFtghuj";
    const minRequiredScore = 4;

    const { isValid, score, validationResult } = validatePasswordStrength(password, {
      mode: "regex",
      minRequiredScore,
    });

    expect(isValid).toBe(false);
    expect(score).toBeLessThan(minRequiredScore);
    expect(validationResult.some((rule) => rule.passed === false)).toBe(true);
  });

  it("uses custom validation messages when provided in configMessages", () => {
    const password = "ZAQ!2wsx";
    const customMessages = {
      minLowercaseMessage: "Custom: At least 1 lowercase letter",
      minUppercaseMessage: "Custom: At least 1 uppercase letter",
      minSpecialCharMessage: "Custom: At least 1 special character",
      minNumberMessage: "Custom: At least 1 number",
      minLengthMessage: "Custom: Password must be at least 8 characters",
    };

    const { isValid, validationResult } = validatePasswordStrength(password, {
      configMessages: customMessages,
    });

    expect(isValid).toBe(true);

    validationResult.forEach((rule) => {
      switch (rule.regex.toString()) {
        case /[a-z]/.toString():
          expect(rule.message).toBe(customMessages.minLowercaseMessage);
          break;
        case /[A-Z]/.toString():
          expect(rule.message).toBe(customMessages.minUppercaseMessage);
          break;
        case /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.toString():
          expect(rule.message).toBe(customMessages.minSpecialCharMessage);
          break;
        case /[0-9]/.toString():
          expect(rule.message).toBe(customMessages.minNumberMessage);
          break;
        case /.{8,}/.toString():
          expect(rule.message).toBe(customMessages.minLengthMessage);
          break;
        default:
          break;
      }
    });
  });
});
