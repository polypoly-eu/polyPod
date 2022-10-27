# google Import

A Feature that lets you import and explore your Google data.

## Building

`npm run build` generates a version of the Feature that can be tested in a web
browser into the `dist` folder.

`npm run watch` automatically rebuilds it when any source files change.

## Testing the reporting backend

1. Change the `polyPediaReport/google` endpoint in
   `platform/utils/endpoints-generator` and rebuild.
2. Start the polyPedia report backend stub: `npm run serve-polypedia-stub`
3. Launch the Feature and attempt to send a report.

The console output of the backend stub will show any reports that would be
submitted.

## Generating documentation

> You need to make the repo-wide install from the root directory: `npm ci`

Run `npm run doc` to generate documentation in the `docs/documentation` directory.
