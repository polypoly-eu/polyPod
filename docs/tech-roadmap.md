# Technical roadmap

The polyPod is still very much a work in progress, and we are planning to add a
lot more functionality to the platform, as well as a lot more power to the
Features that come with it.

At the same time, we have prioritised quick experimentation for quite a while,
leading to a number of technical issues we plan to address:

## Build system

While good old `build.js` has served us well so far, we are planning to
investigate alternative options. The main thing we are missing are incremental
builds, but the developer experience could also be better.

We are planning to publish all the packages and documentation relevant for
Feature development separately, so that it won't be necessary to deal with the
polyPod repository in order to build a Feature.

## Platform

### Feature API

1. Improve test coverage - we recently started to build a dedicated _test_
   Feature that aims to exercise the entire API, but many code paths are still
   tested in platform-specific code, or not at all.
2. Improve documentation - for historical reasons, a lot of the types that show
   up in the documentation are irrelevant for Feature developers.
3. Rename APIs for consistency and easier understanding. For example: For
   historical reasons, the API used to interact with the triplestore is called
   _polyIn_, whereas the API used to interact with the file system is called
   _polyOut_. Better names would be _triplestore_ and _fs_.
4. Add SPARQL support for the polyIn/triplestore - the RDF/JS interface is too
   cumbersome to use for non-trivial data structures.

### Core

Core is fairly new to the code base, and while we are already writing new shared
logic directly in Core, there is still a lot that is duplicated across all
platforms. This needs to be teased out from the platform specific code and moved
into Core. The major ideas are to:

1. Use Core in pod.js via WebAssembly or asm.js.
2. Move Feature API dispatching into Core - this way, Core will call into the
   platform-specific code as needed, not the other way around, eliminating a lot
   of similar boilerplate across platforms.
3. Reimplement the polyOut/fs API in Core, directly interfacing with the file
   system.
4. Reimplement the polyIn/triplestore API in Core.
5. Use Core preferences (instead of Android Preferences, iOS User Defaults etc)
   as the primary key value store.

## Features

1. Reduce duplication across Features, primarily by moving duplicated and
   similar logic to Feature utils - especially UI components.
2. Improve integration test coverage - most Features still rely on manual
   testing.
3. Use the triplestore for most storage needs, only falling back to the file
   system when technically necessary.

## Feature utils

1. Improve test coverage - at the time of writing, our Feature utils are mostly
   tested along with Features that use them, not in isolation.
2. Improve source code documentation.
3. Make poly-cli more powerful - Feature development is still fairly manual,
   quite far from the development workflows offered by Rails and other
   frameworks.
4. Support UI frameworks other than React better - the poly-look component
   library, for example, is mostly React-only.
5. Support languages other than JavaScript and TypeScript better - it's
   currently quite a bit of hassle to set up non-JS projects.

Our usual mantra is to never build utilities speculatively, so in order to do
(4) and (5), we need to either create new Features that don't use JavaScript,
TypeScript or React, or migrate an existing one to a different stack.
