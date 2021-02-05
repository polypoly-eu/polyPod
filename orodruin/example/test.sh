#!/usr/bin/env bash

set -ex

# The orodruin package does currently not end up in the path as expected
ORODRUIN="node node_modules/@polypoly-eu/orodruin/bin/cli.js"

yarn run build
$ORODRUIN test
$ORODRUIN test -b

$ORODRUIN package ./static

node test-package.js
