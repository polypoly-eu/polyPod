# Feature example

A simple Feature to demonstrate the usage of orodruin.

## Requirements

Build orodruin as described [here](../README.md).

## Building and running

### 1. Install dependencies (including orodruin)

```
$ yarn install
```

### 2. Build the feature

```
$ yarn run build
```

### 3. Start the development server

```
$ yarn run serve
```

This will open the feature in your default browser.

## Nice, huh? The rest is, however, broken :(

There are two issues we need to address:

### 1. The tests don't run

While you can run:

```
$ yarn run test
```

It will simply launch a server and hang. This needs fixing - particularly since
we had a nasty issue that only turned up in manual testing - the `include` added
to `rollup-plugin-node-polyfills` in `../rollup.config.js`.

### 2. The _orodruin_ command is not being installed along with the package

No idea why, but there's a workaround for this implemented (in `package.json`
and `test.sh`), so we can probably look away for now.
