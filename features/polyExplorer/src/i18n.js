// Simple translation module loosely modeled after i18next. We might want to
// include a third party translation library (like i18next) in a bit, but for
// now we're keeping it simple.

import strings from "./data/strings.json";

export default {
    t: (key, options = {}) => {
        let translation = strings[key];
        for (let [name, value] of Object.entries(options))
            translation = translation.replace(`{{${name}}}`, value);
        return translation;
    },
};
