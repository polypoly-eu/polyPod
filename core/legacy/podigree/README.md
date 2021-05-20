# podigree

An assortment of Pod implementations of noble descent

## Overview

The [poly-api](https://github.com/polypoly-eu/poly-api) package defines the API that Pods provide to Features.
Included is an executable specification and reference implementation.
For real-world use cases, the reference implementation is not sufficient, because it merely delegates all operations to in-memory implementations.
This library provides additional implementations that cover aspects like logging, input validation and remote access.

Those implementations are provided as composable façades that may be nested.

## Structure

This repository is structured as a TypeScript library with the following implementations per top-level module:

| Module       | Implementation name | Purpose                                              |
| ------------ | ------------------- | -----------------------------------------------------|
| `tracing`    | `TracingPod`        | intercepts all side-effecting calls                  |
| `validation` | `ValidatingPod`     | validates all arguments for each side-effecting call |
| `browser`    | `browserPod`        | a Pod that can be run in-browser                     |
