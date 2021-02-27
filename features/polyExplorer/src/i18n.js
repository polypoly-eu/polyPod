// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

// Sucrase complains about JSON files starting with '{', so we have to wrap it
// in an array for now.
import stringsWrapper from "./data/strings.json";
const strings = stringsWrapper[0];

export default {
    t: (key, options = {}) => {
        let translation = strings[key];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    },
};
