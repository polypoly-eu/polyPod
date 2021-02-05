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

## Testing

```
$ yarn run test
```

Please note that these may well hang if there's an issue - this needs improving.

## Room for improvement

The _orodruin_ command is currently not being installed along with the
_orodruin_ package, which requires workarounds in `package.json` and
`test.sh`. That needs fixing.
