# The polyPod core code

This is the platform independent, shared code of the polyPod.

## Overview

- [api](api) - Specs, tests and reference implementations for all JavaScript
  APIs between polyPod and features.
- [communication](communication) - Communication layer between polyPod and
  features.
- [utils](utils) - Utility packages we felt the need to write. Nothing in there
  is actually core logic, ideally we get rid of all of our own utilities in
  favour of solid third party code.
- [legacy](legacy) - Code we aim to remove, but keep working on for now, either
  because it is still being used, or because we still want to retain parts of
  it.
