# polyPod build logic

This package contains logic for building all the code written in JavaScript (or
that compiles to JavaScript) in the right order.

## Usage

This command:

     ./build.js

will

1. Make a "root" install, that is, install all packages that are common to
   different submodules as well as other dev tools like linting.
2. Install packages in every one of the submodules, by running `npm ci`.
3. Build those packages that need building, running `npm run build`.

Run `./build.js --help` for other available commands.

## Background

The polyPod core code, as well as all the bundled Features, are separated into
several NPM packages that include each other via file URLs. Unfortunately, NPM
does, at the time of writing, not support building a tree of dependent packages,
it's up to us to build everything in the right order.

We experimented with a few tools that should eliminate all, or at least some of
the logic in this module, such as Yarn and pnpm workspaces, and while we could
get those to work with a few workarounds, in the end we decided to stick with
plain NPM. It's probably not the best package manager, but the most widely
understood and supported one in the JavaScript ecosystem.

## Adding a package to the build

If you've added a local package, for example a Feature, that you would like to
build along with the rest of the polyPod, simply add it to
[packages.json](packages.json). The build order is determined automatically from
the dependencies declared in each package, so you don't need to worry about
anything else.
