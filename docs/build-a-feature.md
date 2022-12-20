# Building a polyPod Feature

## The state of Feature development

The polyPod being an experimental platform under development, you will likely
find it lacking some APIs you would like to use, as well as libraries for
performing common tasks with less code. The existing API is also subject to
change - both in terms of interface and semantics - but we are already trying to
keep such changes minimal, preferring to deprecate and replace old APIs instead
of changing them.

As an additional inconvenience, at the time of writing, Features cannot be built
or deployed independently from the polyPod repository. There are two reasons for
that:

1. We haven't published any of the packages below as independent NPM packages,
   so the only way to use them is to build them yourself.
2. The polyPod does currently not support any way of deploying a Feature other
   than bundling it, as described below.

These things are on the roadmap, but to get started today, you'd have to make do
without them.

If none of this can stop you, read on.

## Generating the Feature

Before you do anything else, make sure you've built the polyPod code base as
described [here](../README.md).

The easiest way to create a new Feature is to use
[poly-cli](../dev-utils/poly-cli), e.g.:

    . dev-utils/scripts/env.sh
    cd features
    polycli create feature hello-world

This will create a minimal, effectively empty, Feature based on
[React](https://reactjs.org/) in `features/hello-world`.

## Testing the Feature

Whenever you make changes to the Feature, you need to rebuild it, i.e.:

    cd features/hello-world
    npm run build

Then you can test the Feature by opening `dist/index.html` in a browser of your
choice, e.g. your default browser:

    open dist/index.html

Under the hood, this is using [pod.js](../platform/podjs), which is the most
common environment to use for Feature development, since it's fast and gives you
access to all the usual tools for web development. It is essentially a polyPod
implementation that runs in a regular web browser.

If you already had the Feature open, you can simply reload it after it finished
building. We are looking into automatic refreshing and hot code reloading, but
for the time being, you'll have to reload it manually.

For more convenience, instead or running `build` after every change you make,
you can also run the following command once (and leave it running), so that it
will be automatically rebuilt:

    npm run watch

## Using other languages and frameworks

The generated Features are using JavaScript and React at the moment, because
that's what we use for most of the bundled Features. It is however possible to
to work with vanilla JS/HTML/CSS, frameworks other than React (e.g. Vue), or any
other language that compiles to JavaScript, such as TypeScript. If you want to
deviate from the default stack, feel free to - as you would in a regular web
application.

## The Feature API

While Features are mostly the same as regular web applications, they are much
more heavily sandboxed, and a variety of browser APIs are not available - things
as common as `Fetch`, because allowing arbitrary network communication wouldn't
make much sense in the polyPod platform whose goal it is to put the user in
control of what happens with their data.

Alternatives for these APIs, as well as APIs for capabilities that browsers
don't offer - for example access to the polyPod's personal data storage - are
exposed through the Feature API.

Features can access these various APIs through the `window.pod` object, e.g.:

    (async function () {
        const { info } = window.pod;
        console.log(await info.getRuntime());
    })();

Should write `"podjs"` to the console.

The API is [fully
documented](https://polypoly-eu.github.io/polyPod/platform/feature-api/api/),
but you might still want to take a look at [the existing Features](../features)
for reference.

If you're using TypeScript, you can use the [api](../platform/feature-api/api)
package for type definitions.

## The manifest

Similar to mobile apps, browser extensions, NPM packages and other installable
things, Features have a _manifest_, where you can define common meta data such
as the name and version of the Feature, but also a few specific settings.

One interesting example is the `links` property, where you need to list all of
the URLs that you want to open from within your Feature. The `translations`
property allows you to localise any other property (commonly name, description
and links) for specific languages.

The manifest format is currently not well documented, so please refer to the
manifests of other Features to help understand what the individual properties
do.

## Feature utilities

While you don't have to, there are a number of [Feature
utilities](../feature-utils) we've developed that you can make use of. But you
can generally use any JavaScript library that doesn't require restricted browser
APIs (such as `Fetch`) to work.

## Deploying the Feature

As mentioned above, the only way to deploy polyPod Features right now is to [add
them to the bundle](../features/bundle).

## Help and feedback

If you're interested in building a polyPod Feature, we strongly recommend that
you reach out to us at community@polypoly.coop. This way, we can make sure to
minimise breaking changes, take your needs into account for our own
priorisation, and generally answer your questions - which also helps us improve
our documentation.
