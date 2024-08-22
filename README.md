# Password Strength Analyzer

`password-strength-analyzer` is a utility for evaluating the strength of passwords. It provides a customizable and easy-to-use way to validate password strength, calculate entropy, and assign scores based on predefined rules. This tool can be used independently of any frameworks or libraries, making it versatile for various applications.

The analyzer is based on **entropy calculations** and **predefined regular expression rules**. These features ensure that password strength is assessed rigorously according to established security criteria.

- [Features](#features)
- [Installation](#installation)
- [Configuration Options](#configuration-options)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Example of Customized Usage](#example-of-customized-usage)
- [API](#api)
  - [`validatePasswordStrength`](#validatepasswordstrengthpassword-string-params-ivalidatepasswordstrengthoptions-ivalidatepasswordstrengthresponse)
- [License](#license)
- [Contributing](#contributing)

## Features

- **Entropy Calculation:** Compute the entropy of the password to gauge its strength.
- **Score Calculation:** Assign a score to the password based on entropy and configurable parameters.
- **Flexible Modes:** Choose between **strict**, **regex**, or **score** based validation modes.
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

Here's a basic example of how to use the `validatePasswordStrength`:

```typescript
import { validatePasswordStrength } from "password-strength-analyzer";

const password: string = "ZAQ!2wsx!";

const result = validatePasswordStrength(password);

console.log("Password:", result.password);
console.log("Score:", result.score);
console.log("Entropy:", result.entropy);
console.log("Is Valid:", result.isValid);
console.log("Validation Result:", result.validationResult);

// result:
// {
//   "validationResult": [
//     { "regex": /[a-z]/, "points": 26, "message": "At least 1 lowercase letter", "passed": true },
//     { "regex": /[A-Z]/, "points": 26, "message": "At least 1 uppercase letter", "passed": true },
//     { "regex": /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "points": 33, "message": "At least 1 special character", "passed": true },
//     { "regex": /[0-9]/, "points": 10, "message": "At least 1 number", "passed": true },
//     { "regex": /.{8,}/, "points": 1, "message": "At least 8 characters long", "passed": true }
//   ],
//   "score": 3,
//   "entropy": 52.67970000576925,
//   "password": "ZAQ!2wsx!",
//   "isValid": true
// }
```

### Example of Customized Usage

Here's an example of how to use the `validatePasswordStrength` with customized options:

```typescript
import { validatePasswordStrength } from "password-strength-analyzer";

const password: string = "ZAQ!2wsx!";

const result = validatePasswordStrength(password, {
  maxScore: 7, // Set the maximum score
  minBestEntropy: 90, // Minimum entropy
  minRequiredScore: 4, // Minimum required score
  mode: "strict", // Validation mode
  configMessages: {
    minLowercaseMessage: "Must include at least one lowercase letter",
    minUppercaseMessage: "Must include at least one uppercase letter",
    minSpecialCharMessage: "Must include at least one special character",
    minNumberMessage: "Must include at least one number",
    minLengthMessage: "Must be at least 10 characters long",
  },
});

console.log("Password:", result.password);
console.log("Score:", result.score);
console.log("Entropy:", result.entropy);
console.log("Is Valid:", result.isValid);
console.log("Validation Result:", result.validationResult);

// result:
// {
//   "validationResult": [
//     { "regex": /[a-z]/, "points": 26, "message": "At least 1 lowercase letter", "passed": true },
//     { "regex": /[A-Z]/, "points": 26, "message": "At least 1 uppercase letter", "passed": true },
//     { "regex": /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "points": 33, "message": "At least 1 special character", "passed": true },
//     { "regex": /[0-9]/, "points": 10, "message": "At least 1 number", "passed": true },
//     { "regex": /.{8,}/, "points": 1, "message": "At least 8 characters long", "passed": true }
//   ],
//   "score": 3,
//   "entropy": 52.67970000576925,
//   "password": "ZAQ!2wsx!",
//   "isValid": false
// }
```

## API

### `validatePasswordStrength(password: string, params?: IValidatePasswordStrengthOptions): IValidatePasswordStrengthResponse`

#### Parameters

- **`password`** (`string`): The password to be validated.

- **`params`** (`optional`): Configuration options for the function. You can customize validation rules, set minimum entropy, adjust the scoring system, and provide custom messages.

#### Returns

- **`validationResult`** (`IValidationRule[]`): An array of validation rules with their status. Each rule contains:

  - **`regex`** (`RegExp`): Regular expression used for validation.
  - **`points`** (`number`): Points assigned for passing the rule.
  - **`message`** (`string`): Message to display when the rule is not passed.
  - **`passed`** (`boolean`): Boolean indicating whether the rule was passed.

- **`score`** (`number`): The score assigned to the password based on its entropy and the configured scoring system.

- **`entropy`** (`number`): The entropy of the password, representing its strength and complexity.

- **`password`** (`string`): The current password being evaluated by the function.

- **`isValid`** (`boolean`): Boolean indicating whether the password meets the configured criteria.

## License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes. Make sure to follow the code style and include tests for new features or bug fixes.
