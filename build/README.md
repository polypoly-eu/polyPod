# polyPod build logic

This package contains logic for building all the code written in JavaScript (or
that compiles to JavaScript) in the right order.

## Use

This command

     ./build.js

will

1. Make a "root" install, that is, install all packages that are common to different
   submodules as well as other dev tools like linting.
2. Install packages in every one of the submodules, running a `npm ci`.
3. Build those packages that need building, running `npm run build`

Run `./build.js --help` for other available commands.

## Background

The polyPod core code, as well as all the bundled features, are separated into
several NPM packages that include each other via file URLs. Unfortunately, NPM
does, at the time of writing, not support building a tree of dependent packages,
it's up to us to build everything in the right order.

We experimented with a few tools that should eliminate all, or at least some of
the logic in this module, such as Yarn and pnpm workspaces, and while we could
get those to work with a few workarounds, in the end we decided to stick with
plain NPM. It's probably not the best package manager, but the most widely
understood and supported one in the JavaScript ecosystem.
