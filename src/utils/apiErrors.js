import { CropexHttpError } from "../services/cropexHttp";

function collectErrorText(error) {
  const parts = [];
  if (error instanceof CropexHttpError) {
    parts.push(error.message);
    const body = error.body;
    if (typeof body === "string") parts.push(body);
    if (body && typeof body === "object") {
      parts.push(body.message, body.error, body.details);
      if (typeof body.errors === "string") parts.push(body.errors);
    }
  } else if (error instanceof Error) {
    parts.push(error.message);
  }
  return parts.filter(Boolean).join(" ");
}

export function parseOtpRetrySeconds(error) {
  const text = collectErrorText(error);
  const tryAgainMatch = text.match(/try again in (\d+)\s*seconds?/i);
  if (tryAgainMatch) return Number.parseInt(tryAgainMatch[1], 10);

  if (error instanceof CropexHttpError && error.body && typeof error.body === "object") {
    const body = error.body;
    for (const key of ["retry_after", "retry_in", "retry_seconds", "seconds"]) {
      const value = body[key];
      if (typeof value === "number" && value > 0) return value;
    }
  }

  return null;
}

export function isTechnicalApiMessage(message) {
  const text = String(message || "");
  return (
    /registrationrequest\.|failed on the '|error:field validation|key:\s*'/i.test(text) ||
    /[{[\]}]|statusCode|validation_error|notification\.|SendEmail|resend\.|\.go:\d+|Unauthorized|Forbidden/i.test(
      text,
    ) || text.length > 180
  );
}

export function getUserFacingError(error, fallback = "Something went wrong. Please try again.") {
  const retrySeconds = parseOtpRetrySeconds(error);
  const status = error instanceof CropexHttpError ? error.status : 0;
  const rawMessage = error instanceof Error ? error.message : "";

  if (retrySeconds != null || status === 429) {
    return {
      message: retrySeconds
        ? `OTP already sent. Try again in ${retrySeconds} seconds.`
        : "OTP already sent. Please wait before requesting another code.",
      retrySeconds: retrySeconds ?? 60,
      isCooldown: true,
    };
  }

  if (isTechnicalApiMessage(rawMessage) || isTechnicalApiMessage(collectErrorText(error))) {
    if (status === 404) {
      return { message: "We could not find an account with that email.", retrySeconds: null, isCooldown: false };
    }
    if (status === 400) {
      return { message: "Please check your details and try again.", retrySeconds: null, isCooldown: false };
    }
    if (status === 422) {
      return { message: "Please check your details and try again.", retrySeconds: null, isCooldown: false };
    }
    if (status === 403 || status >= 500) {
      return {
        message: "We could not send the verification code right now. Please try again later.",
        retrySeconds: null,
        isCooldown: false,
      };
    }
    return { message: fallback, retrySeconds: null, isCooldown: false };
  }

  if (/otp already sent|wait before requesting/i.test(rawMessage)) {
    return {
      message: rawMessage,
      retrySeconds: retrySeconds ?? 60,
      isCooldown: true,
    };
  }

  return {
    message: rawMessage.trim() || fallback,
    retrySeconds: null,
    isCooldown: false,
  };
}

export function getDisplayError(error, fallback = "Something went wrong. Please try again.") {
  return getUserFacingError(error, fallback).message;
}

export function getPasswordResetFacingError(
  error,
  fallback = "Could not send the reset code.",
) {
  const facing = getUserFacingError(error, fallback);
  return {
    ...facing,
    message: facing.message
      .replace(/login request failed/gi, "Password reset request failed")
      .replace(/invalid email or password/gi, "We could not start a password reset for this account."),
  };
}
