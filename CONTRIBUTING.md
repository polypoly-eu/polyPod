# Guide to contributors

> This applies to *internal* as well as *external* contributors, i. e., anyone
> willing to contribute code to this open source project.

You are very welcome to participate in this project. Please check the [`README`
file](README.md) for general layout and organization, as well as general
guidelines on how to work with it.

## Prerrequisite

If you wish to contribute code, please send an email to feedback@polypoly.net,
and we will walk you through the process of signing our contributor license
agreement. We will make this process easier over time.

## Coding style

In a repository with so many contributors, it's essential to define a style that
keeps the code in the repository roughly consistent. Please check out (and
configure your editor if needed) the [`.editorconfig`](.editorconfig) file for
the rules that have to be followed all across the repository, for all languages
and other kind of files.

Additionally, the JavaScript/TypeScript code is *linted* with additional
rules. General rules are also defined in [`.eslintrc.cjs`](.eslintrc.js)
file. You will be able to interpret these rules by yourself probably, but just
in case, here are a few rules of thumb:

* We will be checking for a specific ECMA version. Please check the
  configuration file for details.
* Global variables for most known (and endorsed) environments are defined. If
  you add any other environment whose globals are not defined, the best is to
  raise an issue (or see below).
* Check the `ignorePatterns` key for certain mandatory practices, by
  establishing a series of rules for directories that are not going to be
  checked: config files must use the `*.conf.*` pattern; `dist/` needs to be
  used for bundles, `docs/` for docs, `coverage/` for coverage reports, and
  `locales/` for (possibly automatically generated) translation files.

In case you absolutely, totally, irremediably, need to override these settings,
you can do so at the directory level via the usual mechanisms. `eslint` will
respect directory-wide settings. We strongly discourage this for existing
directories, you might want, however, to do this if you create a new directory
(possibly for a feature).

The linting check doesn't cover all possible stylistic choices and code
conventions. So as a *rule of thumb*, try to be consistent with the surrounding
code. We will point out any inconsistencies that we feel need addressing for
maintainability's sake during code review.

## What we are looking for in a contribution

For the time being, issues are disabled in this repo. If it's an easy fix (such
as a typo) you can go and create a pull request, possibly in *draft* mode, so
that the dev team can interact with you. If it's any other kind of issue, such
as a feature request, please email us at feedback@polypoly.eu. Please understand
that this is a temporary solution, and issues will be enabled in due course.

