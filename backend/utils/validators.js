import validator from "validator";
import dns from "node:dns/promises";

// 1. Check the email format (e.g. name@domain.com)
export const isValidEmailFormat = (email) => validator.isEmail(email);

// 2. Check the email's domain really has mail servers (MX records)
export const hasMailServer = async (email) => {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch (error) {
    return false;
  }
};

// 3. Check password strength. Returns an error message, or null if valid
export const getPasswordError = (password) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one capital letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character (e.g. @, #, !, $).";
  }
  return null;
};