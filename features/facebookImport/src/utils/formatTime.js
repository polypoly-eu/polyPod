import i18n from "!silly-i18n";

const defaultFormat = i18n.t("common:time.format");

const defaultDisplayOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

/**
 * Formats time to a string.
 * @callback formatTime
 * @param {number|string|object} time - The time to be formatted.
 * Time as a number (representing seconds since epoch), string (UTC, in the format "YYYY-MM-DD") or a Date object.
 * @param {string} [format] - The format of the date in i18n-format
 * @param {object} [options]
 * @param {string} [options.weekday] - Weekday representation
 * @param {string} [options.day] - Day representation, defaults to "numeric"
 * @param {string} [options.months] - Months representation, defaults to "long"
 * @param {string} [options.year] - Year representation, defaults to "numeric"
 * @returns A string representing the date and time in the format specified by the format parameter.
 */
export const formatTime = (
    time,
    format = defaultFormat,
    options = defaultDisplayOptions
) => {
    let t;
    if (time instanceof Date) t = time;
    else if (!isNaN(+time)) {
        t = new Date(1970, 0, 1);
        t.setUTCSeconds(+time);
    } else if (typeof time == "string") {
        try {
            t = new Date(time);
        } catch (error) {
            console.log(new TypeError(error));
        }
    }
    return t?.toLocaleDateString(format, options);
};
