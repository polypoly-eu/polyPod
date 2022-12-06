# polyImport

A library used to parse and pre-process raw data - usually in conjunction with
[../poly-analysis](../poly-analysis).

## Building

First, follow the instructions in [the top-level README](../../README.md). Then,
you can rebuild polyLook after making changes by running:

    npm run build

Please note that if you want to test changes in a Feature, you will also have to
rebuild that one. To automatically rebuild polyImport and all packages (mainly
Features) depending on it, run:

    npm run build-downstream

## Usage

This part is unfortunately not well documented yet. You can have a look at the
[Google](../../features/google) Feature to figure it out.
