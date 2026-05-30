import { isTechnicalApiMessage } from "./apiErrors";

export const PASSWORD_HINT =
  "Use at least 8 characters with letters, numbers, and a symbol (e.g. Farm2026!).";

export const PASSWORD_ERROR =
  "Password must be at least 8 characters and include letters, numbers, and a symbol.";

export function getStrongPasswordChecks(password) {
  const value = String(password || "");
  return {
    minLength: value.length >= 8,
    hasLetter: /[A-Za-z]/.test(value),
    hasNumber: /\d/.test(value),
    hasSymbol: /[^A-Za-z0-9]/.test(value),
  };
}

export function validateStrongPassword(password) {
  const checks = getStrongPasswordChecks(password);
  if (checks.minLength && checks.hasLetter && checks.hasNumber && checks.hasSymbol) {
    return { valid: true, message: "" };
  }
  return { valid: false, message: PASSWORD_ERROR };
}

export function mapSignupFieldError(field, rawText) {
  const text = String(rawText || "").trim();
  if (!text) return "";

  if (field === "password" || /password|strong_password/i.test(text)) {
    return PASSWORD_ERROR;
  }

  if (isTechnicalApiMessage(text)) {
    switch (field) {
      case "email":
        return "Enter a valid email address.";
      case "phone":
        return "Enter a valid phone number.";
      case "fullName":
        return "Enter your full name.";
      case "gender":
        return "Select a valid gender.";
      default:
        return "";
    }
  }

  return text;
}
