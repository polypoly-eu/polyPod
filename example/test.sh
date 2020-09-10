#!/usr/bin/env bash

set -ex

npm run build
orodruin test
orodruin test -b

orodruin package ./static

node test-package.js
