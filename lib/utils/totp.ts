import { authenticator } from "otplib";

export const TOTP_EXPIRATION_DURATION = 5 * 60; // 5 minutes

authenticator.options = {
  step: TOTP_EXPIRATION_DURATION,
  digits: 6, 
  window: 1, 
};

export const generateTOTPSecret = () => authenticator.generateSecret();

export const generateTOTPCode = (secret: string) => {
  return authenticator.generate(secret);
};

export const verifyTOTPCode = (code: string, secret: string) => {
  return authenticator.check(code, secret);
};
