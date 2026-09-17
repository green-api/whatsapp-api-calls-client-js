import { CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';

export interface Country {
  code: CountryCode;
  /** The dial code without the plus: `7`, `44`, `1`. */
  callingCode: string;
  name: string;
  flag: string;
}

/**
 * The flag as an emoji built from the country code.
 *
 * Two letters map to two regional-indicator symbols, which every current platform renders
 * as a flag. No image set to ship, and nothing to keep in sync when the country list
 * changes — the letters are the picture.
 */
const flagOf = (code: string): string =>
  code
    .toUpperCase()
    .split('')
    .map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65))
    .join('');

/** Country names in the user's own language, falling back to the bare code. */
const names =
  typeof Intl.DisplayNames === 'function'
    ? new Intl.DisplayNames(undefined, { type: 'region' })
    : undefined;

/**
 * Every country the phone library knows, with its dial code.
 *
 * Built from the library rather than kept as a list of our own: the dial codes and the
 * formatting rules then come from one source and cannot drift apart.
 */
export const COUNTRIES: Country[] = getCountries()
  .map((code) => ({
    code,
    callingCode: getCountryCallingCode(code),
    name: names?.of(code) ?? code,
    flag: flagOf(code),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const countryByCode = (code: CountryCode): Country | undefined =>
  COUNTRIES.find((country) => country.code === code);

/**
 * Some country using this dial code, for a number the library could not attribute to one.
 *
 * Several countries share a code — +1 and +7 most visibly — so the one returned here may
 * not be the one the number belongs to. It is used only to label and space the digits: what
 * gets dialled is the dial code plus the national part, which is the same either way.
 */
export const countryByCallingCode = (callingCode: string): Country | undefined =>
  COUNTRIES.find((country) => country.callingCode === callingCode);
