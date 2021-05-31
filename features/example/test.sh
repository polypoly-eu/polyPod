#!/usr/bin/env bash

set -ex

npm run build
orodruin test -d dist
orodruin test -b -d dist

orodruin package ./static -d dist

node test-package.js
