# polyPod build logic

This package contains logic for building all the code written in JavaScript (or
that compiles to JavaScript) in the right order.

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

Still, hopefully we will be able to eliminate this module one day.
