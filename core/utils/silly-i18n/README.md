# silly-i18n

A simple i18n module, following the format and API of
[i18next](https://www.i18next.com/). It takes a language and an hash with
language as primary keys, namespaces as secondary keys, and string names as
tertiary keys.

It includes a function to detect the system language, which should work on the
browser as well as elsewhere.

## Install and test

Run `npm ci` for installing, `npm run test` for carrying out tests.

## Usage

It includes very basic language capabilities based on the browser language
feature.

## Documentation

You can run `npm run doc` to generate documentation. Documentation will appear
in the `docs` directory.

> Please bear in mind that some versions of `cypress` will try to bundle the JS
> found in that directory. If it takes too long or provokes errors just delele them.

Type

```shell
npm run
```

for all commands available.
