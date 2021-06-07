import { existsSync, lstatSync } from "fs";
import { dirname, basename, sep } from "path";
import fs from "fs";
import path from "path";

/**
 * Determines the environment language
 *
 * @returns a two-character standard name for the language, such as 'en'
 */
export const determineLanguage = () =>
    Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];

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

/**
 * Exception class to use when there's some problem with the key used
 * in the translation, either the format or its existence.
 *
 * @class
 */
export class FileNotFoundError extends Error {
    /**
     * Class constructor
     *
     * @param message - Message to include in the error
     */
    constructor(message) {
        super(message);
        this.name = "FileNotFoundError";
    }
}

/**
 * Simple class for performing string translations, with simple templating capabilities
 *
 * @class
 */
export class I18n {
    /**
     * Class constructor
     *
     * @param language - two-letter language code, which should be a key in the translation hash
     * @param translations - translations hash. This is going to have the format `namespace ⇒ key ⇒ string`
     * @throws LanguageError - if the language key is not included in the translations hash
     */
    constructor(language, translations) {
        if (language in translations) {
            this.language = language;
            this._translations = translations[this.language];
        } else {
            throw new LanguageError(
                language + " is not a key in the translations hash provided"
            );
        }
        Object.freeze(this);
    }

    /**
     * Obtains the (translated) string for a `namespace:key` defined in the translations hash.
     *
     * @param key - the translation key in the `namespace:key` format
     * @param options - simple templating capabilities; this will be a key-value hash, so that `{{{key}}}` will be substituted by the key value in this hash
     * @throws TranslationKeyError - if the translation key does not have the correct format, or is missing the key part, or the key does not exist.
     * @returns The translated string.
     */
    t(key, options = {}) {
        if (key.search(/:/) == -1) {
            throw new TranslationKeyError(
                `${key} does not have the format «namespace:key»`
            );
        }
        const [namespace, keyInNamespace] = key.split(/:(.+)/);
        if (
            !keyInNamespace ||
            !(namespace in this._translations) ||
            !(keyInNamespace in this._translations[namespace])
        ) {
            throw new TranslationKeyError(
                `${namespace} does not exist or does not have a ${keyInNamespace} key for language ${this.language}`
            );
        }
        let translation = this._translations[namespace][keyInNamespace];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    }

    /**
     * This function is taken from
     * [cup-readdir, by blubitz](https://github.com/blubitz/cup-readdir/issues/1),
     * under the MIT license
     *
     * @param dir - topmost directory
     * @returns - a list of the directories, with full paths
     */
    static getAllFilePaths(dir) {
        let filePaths = [];
        function readDirRecursively(dir) {
            try {
                let items = fs.readdirSync(dir, {
                    withFileTypes: true,
                });
                let pendingDirs = [];

                items.forEach((item) => {
                    const newDir = path.join(dir, item.name);
                    if (item.isDirectory()) {
                        pendingDirs.push(readDirRecursively(newDir));
                    } else if (item.isFile()) {
                        filePaths.push(newDir);
                    }
                });

                return pendingDirs;
            } catch (err) {
                console.log(err);
            }
        }

        readDirRecursively(dir);
        return filePaths;
    }

    /**
     * Builds the translation hash from files in a directory with the structure
     * languagekey
     *      - namespace
     *          - stringKeys
     *
     * @param directory - the directory files are in
     
     * @returns an instance of a I18n object
     */
    static fromFiles(directoryName, directoryRelPath, language= determineLanguage()) {
        if (!existsSync(directoryName)) {
            throw new FileNotFoundError(directoryName + " can't be found");
        }
        if (!lstatSync(directoryName).isDirectory()) {
            throw new FileNotFoundError(directoryName + " is not really a directory");
        }
        let files = this.getAllFilePaths(directoryName);
        let translations = {};
        files.forEach((f) => {
            const language = dirname(f).split(sep).reverse()[0];
            const ns = basename(f, ".json");
            if (!(language in translations)) {
                translations[language] = {};
            }
            console.log(`${directoryRelPath}/${directoryName}/${language}/${ns}.json`);
            translations[language][ns] = import (`${directoryRelPath}/${directoryName}/${language}/${ns}.json`);
        });
        return new I18n(language, translations);
    }

    /**
     * @return the namespaces in the current translation dictionary
     */
    get namespaces() {
        return Object.keys(this._translations);
    }
}
