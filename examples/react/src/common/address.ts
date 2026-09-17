import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

import { countryByCallingCode, countryByCode } from './countries';

/**
 * A LID is the other kind of address WhatsApp calls understand.
 *
 * It identifies a peer who keeps their number private, so there is no country behind it and
 * nothing to format: the digits are the whole address. It takes the place a country would
 * occupy, because the two are alternatives — an address is one or the other.
 */
export const LID = 'LID' as const;

/** How a peer is addressed: by a country's numbering plan, or by LID. */
export type Addressing = CountryCode | typeof LID;

/** Where the dialler starts before the instance's own number is known. */
export const DEFAULT_COUNTRY: CountryCode = 'US';

export interface Address {
  /** Undefined when the digits match no numbering plan we know. */
  addressing?: Addressing;
  /** National digits for a phone number, the whole address for a LID. */
  digits: string;
  isLid: boolean;
}

/**
 * Splits international digits at the longest leading sequence that is a dial code.
 *
 * The fallback for numbers the phone library declines to attribute — a country's unassigned
 * ranges, `+1 555` among them. Longest first, so `230` is not read as `2`.
 */
const splitByCallingCode = (digits: string): { callingCode?: string; national: string } => {
  for (let length = 3; length >= 1; length--) {
    const callingCode = digits.slice(0, length);

    if (digits.length > length && countryByCallingCode(callingCode)) {
      return { callingCode, national: digits.slice(length) };
    }
  }

  return { national: digits };
};

/** Reads a chatId as an address: `79001234567@c.us`, `106211018023085@lid`. */
export const parseAddress = (chatId: string): Address => {
  const digits = chatId.split('@')[0].replace(/\D/g, '');

  // Keyed on the suffix rather than on the digits, because a LID's digits parse as a
  // perfectly plausible phone number — `275273446613130` reads as South Africa.
  if (chatId.includes('@lid')) {
    return { addressing: LID, digits, isLid: true };
  }

  const parsed = parsePhoneNumberFromString(`+${digits}`);

  if (parsed?.country) {
    return { addressing: parsed.country, digits: parsed.nationalNumber, isLid: false };
  }

  const fallback = splitByCallingCode(digits);

  return {
    addressing: fallback.callingCode ? countryByCallingCode(fallback.callingCode)?.code : undefined,
    digits: fallback.national,
    isLid: false,
  };
};

/** The address as a person reads it: a number spaced by its country, a LID as it is. */
export const formatAddress = (chatId: string): string => {
  const digits = chatId.split('@')[0].replace(/\D/g, '');

  if (chatId.includes('@lid')) {
    return `LID ${digits}`;
  }

  return parsePhoneNumberFromString(`+${digits}`)?.formatInternational() ?? `+${digits}`;
};

/**
 * Which of a contact's two addresses to use, given the kind currently being dialled.
 *
 * Most contacts have only a number, so LID addressing falls back to it rather than leaving
 * the row undialable: what the dialler then shows is a number, which is also what it dials.
 */
export const pickAddress = (
  contact: { id: string; lid?: string },
  addressing: Addressing
): string => (addressing === LID && contact.lid ? contact.lid : contact.id);

/**
 * The address as the API takes it. A phone goes out bare; the client appends `@c.us`.
 *
 * The number is resolved against the chosen country rather than glued to its dial code,
 * because what people type is not always the national part: a trunk prefix (`8` in Russia,
 * `0` in the UK) or a pasted country code would otherwise survive into the dialled address
 * and reach a different number than the one the field was showing.
 */
export const toDialTarget = (addressing: Addressing, digits: string): string => {
  if (addressing === LID) {
    return `${digits}@lid`;
  }

  const parsed = parsePhoneNumberFromString(digits, addressing);

  return parsed
    ? parsed.number.replace('+', '')
    : `${countryByCode(addressing)?.callingCode ?? ''}${digits.replace(/\D/g, '')}`;
};
