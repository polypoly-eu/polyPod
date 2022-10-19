# polyPod architecture

## How it works

You can think about the polyPod as a special purpose web browser, with some
important differences:

1. Features are, unlike websites, *installed*, from a trusted source - not
   directly loaded from servers.
2. Features are highly *restricted* in what they can do without user approval:
   Something as basic as network communication can easily be denied by the user.
3. Unlike web browsers, the polyPod offers a *central store* for all data, that
   Features can read and write based on shared schemas, governed by the
   polyPod's permission system - and ultimately user consent. This store exists
   solely on the user's own device - there is no server-side.

Because of these differences, the polyPod can reason about user data, explain
what Features are trying to do with it, including the implications of that, and
give users complete control about what data leaves their device for what
purpose.

## [Platform](../platform)

The platform is what provides the actual runtime and data store - in the analogy
above, this would be the web browser.

At the time of writing, we have three different implementations of the platform
layer:

- [Android](../platform/android)
- [iOS](../platform/ios)
- [pod.js](../platform/podjs)

### The main user interface

The main user interface primarily allows users to launch and exit Features. This
may work and look quite different in each implementation, depending on the
environment.

On Android and iOS, the UI is quite similar, presenting a list of Features the
user can launch, and an app bar on top they can use to close it again, and
trigger some other actions if the Feature provides them. pod.js is a bit of a
special case, in that it doesn't have a way for the user to launch different
Features - instead it produces a different web app for each.

### The Feature storage

There are two ways to use Features within the polyPod: They can either be
_bundled_ with the platform, so that they can be used without installation, or
they can be installed from a _Feature Depot_.

At the time of writing, the second mechanism isn't supported on any platform
yet. But due to the nature of pod.js, there is no need to install Features,
since they are being distributed individually to begin with.

### The Feature runtime

The runtime executes the Features' code and renders their user interface. This
is essentially a sandboxed browser engine in all current implementations.

### The [Feature API](../platform/feature-api)

The API provides JavaScript functions that Features can load and call for things
that are not permitted within the sandbox of the runtime, for example accessing
the central data store, or network communication.

On most implementations, there is an RPC layer between Feature and platform, but
that is an implementation detail Features aren't exposed to, because every
platform implementation provides the same JavaScript file Features merely need
to load, with the same functions they can call.

### Data storage

The main way for Features to store data is the _Triplestore_, a [Linked data][1]
store all Features have access to - as long as the platform, and by extension
the user, allows it.

Another way for Features to store data is the file system, but since each
Feature has their own root, it is not possible to share data between Features
this way. It is currently mainly being used for storing raw user data and
caching.

### [Core](../platform/core)

Since there are a number of different implementations of the platform, there is
a lot of shared logic, that would have to be duplicated in each
implementation. In order to avoid this, there is the core which contains most of
the environment independent logic.

## Features

If the platform is the web browser in the analogy above, Features are the
websites. Features are, in fact, websites - offline websites that don't have
access to various browser APIs.

While some libraries don't work without access to restricted functionality such
as `Fetch`, Feature development is, for the most part, like developing a single
page web application - common frameworks like React work out of the box.

At the moment, Feature developers still need to ensure that they render and work
correctly in all polyPod implementations, whose rendering and JavaScript engines
differ sligthly. Therefore the use of third party tools for cross browser
development, such as ES6 transpilers, is recommended.

### [Feature utils](../feature-utils)

Similar to how an operating system might want to implement as much functionality
as possible in user space rather than kernel space, we, too, aim to implement
what functionality we _can_ implement outside the platform, in our various
Feature utilities.

These are essentially regular JavaScript libraries and tools, some of which use
the Feature API directly, to make it easier for Features to implement common use
cases, or, in the case of [polyLook](../feature-utils/poly-look), their user
interface.

[1]: https://en.wikipedia.org/wiki/Linked_data
