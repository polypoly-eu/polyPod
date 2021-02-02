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

## Except it doesn't work

The build is currently broken, there are three issues:

### 1. _orodruin_'s `container.js` is broken

_If we fix just one issue, it should be this one._

The example feature currently runs into a runtime issue during `yarn run serve`,
the culprit is the following line in `../dist/container.js`:

```
    var isWin = process.platform === 'win32';
```

One workaround is to include _podigree_ using the `file:` instead of the `link:`
protocol in _orodruin_. That makes the line look like this:

```
    var isWin = browser$1.platform === 'win32';
```

This workaround, however, causes Yarn 2.x to uncontrollably recreate
_orodruin_'s `yarn.lock` file, which doesn't happen with Yarn 1.x. So we either
have to switch back to Yarn 1.x, or ignore the lock file for the _orodruin_
build. That sucks!

There's another workaround: The problematic line of code is actually coming from
a dependency of the _memfs_ package, which is being used in _podigree_. So
another workaround is to eliminate the usage of _memfs_ from the code. But that
sucks too!

So we need a proper solution.

### 2. The tests don't run

While you can run:

```
$ yarn run test
```

It will simply launch a server and hang. This needs fixing. Hopefully these
tests will make the `container.js` issue visible - currently it can only be
tested manually.

### 3. The _orodruin_ command is not being installed along with the package

No idea why, but there's a workaround for this implemented (in `package.json`
and `test.sh`), so we can probably look away for now.
