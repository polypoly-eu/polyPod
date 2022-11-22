import { LanguageError } from "./errors.js";
import { determineLocale } from "./locale.js";

/**
 * Performs localization of dates and numbers.
 *
 * @class
 */
export class L12n {
    /**
     * Create a new instance.
     *
     * @param {string} [locale] - The locale string, in the usual format
     * `xx[_YY]`. Determined automatically if not specified.
     * @throws LanguageError - If the provided locale is incorrect or does not
     * exist.
     */
    constructor(locale = determineLocale()) {
        let canonicalLocale;
        try {
            canonicalLocale = Intl.getCanonicalLocales(locale)[0];
        } catch (error) {
            if (error.name == "RangeError") {
                throw new LanguageError(
                    canonicalLocale + " is not a supported locale"
                );
            }
        }
        if (!canonicalLocale.match(/^[a-z]{2,3}\b(_[A-Z]{2,4}\b)?/)) {
            throw new LanguageError(
                canonicalLocale + " does not follow the usual locale format"
            );
        }

        if (
            Intl.NumberFormat.supportedLocalesOf([canonicalLocale]).length == 0
        ) {
            throw new LanguageError(
                canonicalLocale + " does not support numeric formats"
            );
        }

        this._locale = canonicalLocale;
    }

    /**
     * The active locale.
     * @type {string}
     */
    get locale() {
        return this._locale;
    }

    /**
     * Converts the supplied value to a localized string.
     *
     * @param object - The value to localize. For the time being, only `number`
     * and `Date` values are supported.
     * @returns {string} The localized string.
     */
    t(object) {
        if (object instanceof Date) {
            return Intl.DateTimeFormat(this._locale).format(object);
        }
        if (!isNaN(parseFloat(object))) {
            return Intl.NumberFormat(this._locale).format(parseFloat(object));
        }
        return object;
    }
}
