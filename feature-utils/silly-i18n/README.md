# silly-i18n

A simple i18n library, following the format and API of
[i18next](https://www.i18next.com/).

## Testing

    npm run test

## Usage

### Using the Rollup plugin

We typically use the Rollup plugin to reduce boilerplate code. Just import it in
your Rollup config:

    import sillyI18n from "@polypoly-eu/silly-i18n/rollup-plugin.js";

And then add it to the `plugins` section:

    plugins: [
        sillyI18n(),
        ...
    ]

The plugin will look for a directory called _locales_ and bundle its contents.

Then you can import it like this:

    import i18n from "!silly-i18n";

This will give you an instance of the `I18n` class, with language and locale
automatically determined.

### Manual integration

Simply create an instance of the `I18n` class and use it across your
project. You will need to pass the language, as well as an object with all of
your translations, retrieved by your means of choice.

To get automatic language detection, use `determineLanguage()`.

### Using the i18n object

The basic usage to retrieve a translated string is:

    i18n.t("namespace:key")

For more use cases, e.g. placeholder replacement, see the documentation.

### Using the l12n object

For simple number and date formatting, you can use `L12n`, for example:

    i18n.l12n.t(new Date())
