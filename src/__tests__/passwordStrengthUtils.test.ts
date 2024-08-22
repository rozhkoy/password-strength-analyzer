import { describe, expect, it } from "vitest";
import { calculateEntropy, calculatePasswordScore, validatePasswordRules } from "../utils";

describe("calculateEntropy", () => {
  it("should return 0 if points is 0", () => {
    const result = calculateEntropy(0, "password");
    expect(result).toBe(0);
  });

  it("calculate entropy with empty password", () => {
    const result = calculateEntropy(10, "");
    expect(result).toBe(0);
  });

  it("calculate entropy for a given password and points", () => {
    const points = 26;
    const password = "password";
    const passwordLength = new Set(password).size;
    const expectedEntropy = passwordLength * Math.log2(points);
    const result = calculateEntropy(points, password);

    expect(result).toBe(expectedEntropy);
  });

  it("calculate entropy with all unique characters", () => {
    const password = "abcdefg";
    const points = 10;
    const uniqueCharsCount = new Set(password).size;
    const expectedEntropy = uniqueCharsCount * Math.log2(points);
    const result = calculateEntropy(points, password);

    expect(result).toBeCloseTo(expectedEntropy);
  });

  it("calculate entropy with repeating characters", () => {
    const password = "aaaaaa";
    const points = 5;
    const uniqueCharsCount = new Set(password).size;
    const expectedEntropy = uniqueCharsCount * Math.log2(points);
    const result = calculateEntropy(points, password);

    expect(result).toBeCloseTo(expectedEntropy);
  });
});

describe("calculatePasswordScore", () => {
  it("handles 0 entropy by returning 0 score", () => {
    const entropy = 0;
    const minBestEntropy = 50;
    const maxScore = 5;
    const result = calculatePasswordScore(entropy, minBestEntropy, maxScore);
    expect(result).toBe(0);
  });

  it("handles max score correctly at minBestEntropy level", () => {
    const entropy = 80;
    const minBestEntropy = 80;
    const maxScore = 5;
    const result = calculatePasswordScore(entropy, minBestEntropy, maxScore);
    expect(result).toBe(maxScore);
  });

  it("handles max score correctly at maxScore level", () => {
    const entropy = 80;
    const minBestEntropy = 80;
    const maxScore = 9;
    const result = calculatePasswordScore(entropy, minBestEntropy, maxScore);
    expect(result).toBe(maxScore);
  });

  it("returns 1 when entropy is just above 0 ", () => {
    const entropy = 80;
    const minBestEntropy = 80;
    const maxScore = 9;
    const result = calculatePasswordScore(entropy, minBestEntropy, maxScore);
    expect(result).toBe(maxScore);
  });

  it("returns a score between 1 and maxScore when entropy is between 0 and minBestEntropy", () => {
    const entropy = 25;
    const minBestEntropy = 50;
    const maxScore = 5;
    const expectedScore = Math.floor(entropy / (minBestEntropy / (maxScore - 1))) + 1;
    const result = calculatePasswordScore(entropy, minBestEntropy, maxScore);
    expect(result).toBe(expectedScore);
  });

  it("returns maxScore when entropy exceeds minBestEntropy", () => {
    const entropy = 100;
    const minBestEntropy = 50;
    const maxScore = 5;
    const result = calculatePasswordScore(entropy, minBestEntropy, maxScore);
    expect(result).toBe(maxScore);
  });
});

describe("validatePasswordRules", () => {
  it("validates given password by rules", () => {
    const rules = [
      { regex: /[a-z]/, points: 26, message: "At least 1 lowercase letter", passed: false },
      { regex: /[A-Z]/, points: 26, message: "At least 1 uppercase letter", passed: false },
      { regex: /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, points: 33, message: "At least 1 special character", passed: false },
      { regex: /[0-9]/, points: 10, message: "At least 1 number", passed: false },
      { regex: /.{8,}/, points: 1, message: "At least 8 characters long", passed: false },
    ];

    const password = "ZAQ!2wsx";

    const { result, points } = validatePasswordRules(password, rules);

    expect(points).toBe(96);
    result.forEach((rule) => expect(rule.passed).toBe(true));
  });
});
