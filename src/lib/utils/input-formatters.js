/**
 * Input formatters for checkout forms.
 * All functions are pure and work with controlled inputs.
 */

const MAX_NOTES_LENGTH = 500;
const MAX_CVC_LENGTH = 4;

/** Strips everything except digits */
export function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

/** Formats credit card: 1234 5678 9012 3456 */
export function formatCardNumber(value) {
  const raw = digitsOnly(value).slice(0, 16);
  return raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Formats expiry: MM/AA */
export function formatExpiry(value) {
  const raw = digitsOnly(value).slice(0, 4);
  if (raw.length >= 3) {
    return `${raw.slice(0, 2)}/${raw.slice(2)}`;
  }
  return raw;
}

/** Formats CVC: 1234, max 4 digits */
export function formatCvc(value) {
  return digitsOnly(value).slice(0, MAX_CVC_LENGTH);
}

/** Formats Argentina phone numbers */
export function formatPhone(value) {
  const hasPlus = value.startsWith("+");
  let raw = digitsOnly(value);

  if (raw.length === 0) return hasPlus ? "+" : "";

  // With country code: +54 9 11 1234-5678
  if (hasPlus || raw.startsWith("54")) {
    if (raw.startsWith("54")) raw = raw.slice(2);
    // +54 9 ## ####-####
    if (raw.length > 0 && raw[0] === "9") {
      const rest = raw.slice(1);
      const area = rest.slice(0, 2);
      const num = rest.slice(2);
      let out = `+54 9`;
      if (area) out += ` ${area}`;
      if (num.length > 4) {
        out += ` ${num.slice(0, 4)}-${num.slice(4, 8)}`;
      } else if (num) {
        out += ` ${num}`;
      }
      return out.trim();
    }
    // +54 ## ####-#### (landline without 9)
    const area = raw.slice(0, 2);
    const num = raw.slice(2);
    let out = "+54";
    if (area) out += ` ${area}`;
    if (num.length > 4) {
      out += ` ${num.slice(0, 4)}-${num.slice(4, 8)}`;
    } else if (num) {
      out += ` ${num}`;
    }
    return out.trim();
  }

  // Without country code: 11 1234-5678
  const area = raw.slice(0, 2);
  const num = raw.slice(2);
  let out = "";
  if (area) out += area;
  if (num.length > 4) {
    out += ` ${num.slice(0, 4)}-${num.slice(4, 8)}`;
  } else if (num) {
    out += ` ${num}`;
  }
  return out.trim();
}

/** Limits notes length */
export function limitNotes(value) {
  return value.slice(0, MAX_NOTES_LENGTH);
}

/** Extracts raw digits from formatted card for validation/review */
export function rawCardNumber(formatted) {
  return digitsOnly(formatted);
}

/** Extracts raw digits from formatted expiry */
export function rawExpiry(formatted) {
  return digitsOnly(formatted);
}
