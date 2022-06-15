/**
 * Exception class for errors related to the language that is
 * requested for the translation object
 *
 * @class
 */
export class LanguageError extends Error {
    /**
     * Class constructor
     *
     * @param message - Actual message included in the error
     */
    constructor(message) {
        super(message);
        this.name = "LanguageError";
    }
}

/**
 * Exception class to use when the section/namespace does not exist
 *
 * @class
 */
export class NonExistingSectionError extends Error {
    /**
     * Class constructor
     *
     * @param message - Message to include in the error
     */
    constructor(message) {
        super(message);
        this.name = "NonExistingSectionError";
    }
}

/**
 * Exception class to use when there's some problem with the key used
 * in the translation, either the format or its existence.
 *
 * @class
 */
export class TranslationKeyError extends Error {
    /**
     * Class constructor
     *
     * @param message - Message to include in the error
     */
    constructor(message) {
        super(message);
        this.name = "TranslationKeyError";
    }
}
