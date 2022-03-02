import { LanguageError } from "./errors.js";
import { determineLocale } from "./locale.js";

/**
 * Simple class for performing string translations, with simple templating capabilities
 *
 * @class
 */
export class L12n {
    /**
     * Class constructor for the localization class. The locale used will be auto-detected (by default)
     * and stored as a private, read-only attribute. This is going to essentially be an encapsulation of
     * the existing localle, deferring all actual processing to the `Intl` standard library.
     *
     * @param {string} [ locale = determineLocale() ] - locale string, in the usual format xx[_YY],
     *     by default locale determined using that function
     * @throws LanguageError - if the provided language is incorrect in some way (inexistent, or incorrect string format)
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
     * Returns the locale string.
     *
     * @returns locale string in the usual `xx-XX` format.
     */
    get locale() {
        return this._locale;
    }

    /**
     * Obtains the (translated) string for a `namespace:key` defined in the translations hash.
     *cd .
     * @param object - What needs to be translated. For the time being, only translates numbers
     * @returns The locale-formatted string.
     */
    t(object) {
        if (!isNaN(parseFloat(object))) {
            return Intl.NumberFormat(this._locale).format(parseFloat(object));
        }
        return object;
    }
}
