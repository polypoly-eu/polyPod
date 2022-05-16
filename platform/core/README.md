# PolyPod platform core

Logic shared across polyPod platforms - ios, android, wasm.

## Requirements

-   [Rust toolchain](https://www.rust-lang.org/tools/install). Core is built with Rust 1.58.1.
-   The build prerequisites for [FlatBuffers](https://github.com/google/flatbuffers), currently primarily a C++ toolchain.

## Building

On most systems, you can simply run `make`, and that will handle everything.

It is required to run `make` in a bash terminal which contains the necessary dependencies - curl, make, unzip. MacOS and Linux systems terminal should already have everything needed. On Windows, a terminal like [GitBash](https://gitforwindows.org) is needed.

## Testing

Just run:

    cargo test
