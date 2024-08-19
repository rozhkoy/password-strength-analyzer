# Password Strength Analyzer

`password-strength-analyzer` is a React hook for evaluating the strength of passwords. It provides a customizable and easy-to-use way to validate password strength, calculate entropy, and assign scores based on predefined rules.

## Features

- **Customizable Validation Rules:** Define your own rules for password validation.
- **Entropy Calculation:** Compute the entropy of the password to gauge its strength.
- **Score Calculation:** Assign a score to the password based on entropy and configurable parameters.
- **Flexible Modes:** Choose between strict, regex, or score-based validation modes.
- **Configurable Messages:** Customize the messages displayed for different validation rules.
- **TypeScript Support:** Fully typed for improved development experience with TypeScript.

## Installation

To install the package, use npm:

```bash
npm install password-strength-analyzer
```

## Configuration Options

You can configure the hook with various options:

- **`maxScore`**:

  - _Type_: `number`
  - _Description_: Maximum score that can be assigned to the password.
  - _Default_: `5`

- **`minBestEntropy`**:

  - _Type_: `number`
  - _Description_: Minimum entropy required for a top score.
  - _Default_: `80`

- **`minRequiredScore`**:

  - _Type_: `number`
  - _Description_: Minimum score required for a valid password.
  - _Default_: `3`

- **`mode`**:

  - _Type_: `"strict" | "regex" | "score"`
  - _Description_: Validation mode. Choose from:
    - `"strict"`: Requires both high score and specific point thresholds.
    - `"regex"`: Requires specific point thresholds.
    - `"score"`: Requires a minimum score to be valid.
  - _Default_: `"strict"`

- **`configMessages`**:
  - _Type_: `IValidationMessages`
  - _Description_: Custom validation messages for different rules. You can provide custom messages for:
    - `minLowercaseMessage`: Message for lowercase letter requirement.
    - `minUppercaseMessage`: Message for uppercase letter requirement.
    - `minSpecialCharMessage`: Message for special character requirement.
    - `minNumberMessage`: Message for number requirement.
    - `minLengthMessage`: Message for minimum length requirement.

## Usage

### Basic Usage

Here's a basic example of how to use the `usePasswordStrength` hook in a React component:

```typescript
import React from "react";
import { usePasswordStrength } from "password-strength-analyzer";

const PasswordInput: React.FC = () => {
  const { validatePassword, score, entropy, validationResult } = usePasswordStrength();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    validatePassword(password);
  };

  return (
    <div>
      <input type="password" onChange={handleChange} />
      <div>
        <p>Score: {score}</p>
        <p>Entropy: {entropy}</p>
        <ul>
          {validationResult.map((rule, index) => (
            <li key={index} style={{ color: rule.passed ? "green" : "red" }}>
              {rule.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordInput;
```

### Example of Customized Usage

Here's an example of how to use the `usePasswordStrength` hook with customized options:

```typescript
import { usePasswordStrength } from "password-strength-analyzer";

const { validatePassword, score, entropy, validationResult } = usePasswordStrength({
  maxScore: 10,
  minBestEntropy: 100,
  minRequiredScore: 7,
  mode: "score",
  configMessages: {
    minLowercaseMessage: "Need at least one lowercase letter.",
    minUppercaseMessage: "Must include an uppercase letter.",
    minSpecialCharMessage: "Special character required.",
    minNumberMessage: "Include at least one number.",
    minLengthMessage: "Minimum length of 8 characters.",
  },
});

const password = "ZAQ!2wsxXSW@1qaz";
const isValid = validatePassword(password);

console.log("Password Valid:", isValid);
console.log("Password Score:", score);
console.log("Password Entropy:", entropy);
console.log("Validation Results:", validationResult);
```

## API

### `usePasswordStrength(params?: IUsePasswordStrengthParams): IUsePasswordStrengthActions`

#### Parameters

- **`params`** (optional): Configuration options for the hook. You can customize validation rules, set minimum entropy, and adjust the scoring system.

#### Returns

- **`validationResult: IValidationRule[]`**: An array of validation rules with their status. Each rule contains:

  - `regex`: Regular expression used for validation.
  - `points`: Points assigned for passing the rule.
  - `message`: Message to display when the rule is not passed.
  - `passed`: Boolean indicating whether the rule was passed.

- **`score: number`**: The score assigned to the password based on its entropy and the configured scoring system.

- **`entropy: number`**: The entropy of the password, representing its strength and complexity.

- **`validatePassword(password: string): boolean`**: Function to validate the password. It updates the score and entropy based on the provided password and returns a boolean indicating whether the password meets the configured criteria.

- **`password: string`**: The current password being evaluated by the hook.

## License

MIT License. See the LICENSE file for details.

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes. Make sure to follow the code style and include tests for new features or bug fixes.
