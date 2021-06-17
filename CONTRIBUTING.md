# Guide to contributors

> This applies to *internal* as well as *external* contributors, i. e., anyone willing to contribute code to this open source project.

You are very welcome to participate in this project. This repository includes the [core components](core/) of the polyPod, as well as [pod.js, the browser-based polypod](podjs) and some [Features](features/) that are integrated into the [Android](android/) and [iOS](ios/) apps. This means that it includes a variety of tools, as well as languages. Core and features are written in TypeScript and JavaScript, while the Android app uses Kotlin and the iOS app uses Swift. Feel free to browse it, and contribute via PR with the following requisites.

## Prerrequisite

Any external contributor will need to sign a [contributor license agreement](https://en.wikipedia.org/wiki/Contributor_License_Agreement). This will allow us to license your contribution under the same license as the rest of the repository. This will be need to be mailed to the same address [listed for issues](README.md#issues).

## Coding style

In a repository with so many contributors, it's essential to define a style that keeps the code in the repository roughly consistent. Please check out (and configure your editor if needed) the [`.editorconfig`](.editorconfig) file for the rules that have to be followed all across the repository, for all languages and other kind of files.

Additionally, the JavaScript/TypeScript code is *linted* with additional rules. General rules are also defined in [`.eslintrc.cjs`](.eslintrc.js) file, and checked via the `./build.js lint` command. Please check out [these instructions in the main README](README.md#testing) for running this and other test, and also fix fixable lint problems that might arise. You will be able to interpret these rules roughly probably, but just in case, here are a few rules of thumb:

* We will be checking for tthe latest ECMA version, 2020.
* Global variables for most known (and endorsed) environments are defined. If you add any other environment whose globals are not defined, the best is to raise an issue (or see below).
* Check the `ignorePatterns` key for certain mandatory practices, by establishing a series of rules for directories that are not going to be checked: config files must use the `*.conf.*` pattern; `dist/` needs to be used for bundles, `docs/` for docs, `coverage/` for coverage reports, and `locales/` for (possibly automatically generated) translation files.

In case you absolutely, totally, irremediably, need to override these settings, you can do so at the directory level via the usual mechanisms. `eslint` will respect directory-wide settings. We strongly discourage this for existing directories, you might want, however, to do this if you create a new directory (possibly for a feature).

## What we are looking for in a contribution

Anything that contributes to the improvement of the code or documentation will be very welcome. As you can see, for the time being there are no issues in the repository, so if you want to engage the devs the best way is to open an exploratory pull request, maybe in draft mode, so that we can get back to you (and also ask you to sign the CLA, see above.)