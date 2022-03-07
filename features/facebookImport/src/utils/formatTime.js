import i18n from "../i18n";

const defaultFormat = i18n.t("common:time.format");

const defaultDisplayOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

/**
 * Formats time to a string
 * @param {number || string || object} time - Time as a number (seconds), string (UTC) or a Date object
 * @param {string = i18n-format} format
 * @param {object} options
 * @param {string} options.weekday - Weekday representation
 * @param {string = "numeric"} options.day - Day representation
 * @param {string = "long"} options.months - Months representation
 * @param {string = "numeric"} options.year - Year representation
 * @returns string
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
