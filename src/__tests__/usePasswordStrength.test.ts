import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePasswordStrength } from "../usePasswordStrength";

describe("usePasswordStrength", () => {
  it("validates given password by rules with default options", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 3;

    const { result } = renderHook(() => usePasswordStrength());

    let validationResponse = false;
    act(() => {
      validationResponse = result.current.validatePassword(password);
    });

    expect(validationResponse).toBe(true);
    expect(result.current.entropy).toBe(expectedEntropy);
    expect(result.current.score).toBe(expectedScore);
    result.current.validationResult.forEach((rule) => expect(rule.passed).toBe(true));
  });

  it("adjusts score based on custom entropy and score settings", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 7;

    const { result } = renderHook(() =>
      usePasswordStrength({
        maxScore: 10,
        minBestEntropy: 100,
        minRequiredScore: 7,
      })
    );

    let validationResponse = false;
    act(() => {
      validationResponse = result.current.validatePassword(password);
    });

    expect(validationResponse).toBe(false);
    expect(result.current.entropy).toBe(expectedEntropy);
    expect(result.current.score).toBeLessThan(expectedScore);
    result.current.validationResult.forEach((rule) => expect(rule.passed).toBe(true));
  });

  it("validates given password by rules with minBestEntropy 100", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 3;
    const { result } = renderHook(() =>
      usePasswordStrength({
        minBestEntropy: 100,
      })
    );
    let validationResponse = false;
    act(() => {
      validationResponse = result.current.validatePassword(password);
    });

    expect(validationResponse).toBe(true);
    expect(result.current.entropy).toBe(expectedEntropy);
    expect(result.current.score).toBe(expectedScore);
    result.current.validationResult.forEach((rule) => expect(rule.passed).toBe(true));
  });

  it("validates given password by rules with score mode", () => {
    const password = "ZAQew2ws";
    const expectedEntropy = 41.84095946449942;
    const expectedScore = 3;

    const { result } = renderHook(() =>
      usePasswordStrength({
        mode: "score",
        minRequiredScore: 4,
      })
    );
    let validationResponse = false;
    act(() => {
      validationResponse = result.current.validatePassword(password);
    });

    expect(validationResponse).toBe(false);
    expect(result.current.entropy).toBe(expectedEntropy);
    expect(result.current.score).toBe(expectedScore);
  });

  it("validates given password by rules with regex mode", () => {
    const password = "ZAQ!2wsx";
    const expectedEntropy = 52.67970000576925;
    const expectedScore = 3;

    const { result } = renderHook(() =>
      usePasswordStrength({
        mode: "regex",
        minRequiredScore: 4,
      })
    );
    let validationResponse = false;
    act(() => {
      validationResponse = result.current.validatePassword(password);
    });

    expect(validationResponse).toBe(true);
    expect(result.current.entropy).toBe(expectedEntropy);
    expect(result.current.score).toBe(expectedScore);
    result.current.validationResult.forEach((rule) => expect(rule.passed).toBe(true));
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

    const { result } = renderHook(() =>
      usePasswordStrength({
        configMessages: customMessages,
      })
    );

    let validationResponse = false;
    act(() => {
      validationResponse = result.current.validatePassword(password);
    });

    expect(validationResponse).toBe(true);

    result.current.validationResult.forEach((rule) => {
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
