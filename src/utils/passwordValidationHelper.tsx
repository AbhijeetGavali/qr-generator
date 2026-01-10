export function getPasswordErrors(status: any) {
  const errors: string[] = [];

  if (status.containsLowercaseLetter === false)
    errors.push("At least one lowercase letter");

  if (status.containsUppercaseLetter === false)
    errors.push("At least one uppercase letter");

  if (status.containsNumericCharacter === false)
    errors.push("At least one number");

  if (status.containsNonAlphanumericCharacter === false)
    errors.push("At least one special character");

  if (status.meetsMinLength === false)
    errors.push("Minimum length requirement not met");

  return errors;
}
