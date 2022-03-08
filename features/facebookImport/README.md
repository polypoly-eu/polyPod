# facebookImport

A feature that lets you import and explore your Facebook data.

## Building

`npm run build` generates a version of the feature that can be tested in a web
browser into the `dist` folder.

`npm run watch` automatically rebuilds it when any source files change.

## Testing the reporting backend

To test the reporting backend, you will need to start two services:

1. The polyPedia report backend stub: `npm run serve-polypedia-stub`
2. A HTTP server for the feature (which is the only way to allow network
   requests in the pod.js environment): `npm run serve`

Then navigate to the URL shown by the latter command. The console output of the
first command will show any reports that are being submitted.

## Generating documentation

> You need to make the repo-wide install from the root directory: `npm ci`

Run `npm run doc` to generate documentation in the `docs` directory.
