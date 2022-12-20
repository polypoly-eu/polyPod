# polyLook Storybook

This module contains an interactive preview for polyLook based on
[Storybook](https://storybook.js.org).

## Requirements

First, build polyLook as described [here](../README.md).

Then, install the dependencies of this module:

    npm ci

## Running

You will most likely want to run see the Storybook for the production
(mostly React) components:

    npm run storybook

To run it for the experimental LitElement components instead:

    npm run storybook:lit
