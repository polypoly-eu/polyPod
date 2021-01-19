# orodruin

![Node CI](https://github.com/polypoly-eu/orodruin/workflows/Node%20CI/badge.svg)

CLI tool supporting the development lifecycle of Features

## Requirements

- [Node.js](https://nodejs.org/), at least v13
- Access to the _polypoly-eu_ package repository; currently only granted to
  polypoly employees. Follow
  [The Tinkerer's Handbook](https://wiki.polypoly.eu/display/TIN/The+Tinkerer%27s+Handbook)
  to set it up.

## Building

```
$ npm install
$ npm run build
```

## Installing (optional)

Features working with the `orodruin` command typically install it as a
dependency, but if you would like to work with the command directly, you can
install it globally:

```
$ npm install -g
$ orodruin --help
```

## Developing Features

After building orodruin as described above, you can use it to develop features.
See [example/README.md](example/README.md) for an example.
