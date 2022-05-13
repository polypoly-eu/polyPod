# PolyPod platform core

Logic shared across polyPod platforms - ios, android, wasm.

## Requirements

-   [Rust toolchain](https://www.rust-lang.org/tools/install). Core is built with Rust 1.58.1.
-   The build prerequisites for [FlatBuffers](https://github.com/google/flatbuffers), currently primarily a C++ toolchain.

## Building

It is required to run `make` in a bash terminal which contains the necessary dependencies - curl, make, unzip. MacOS and Linux systems terminal should already have everything needed. On Windows, a terminal like [GitBash](https://gitforwindows.org) is needed.

If you wish to only build the core binaries for your current operating system,
run `make core`. If you only wish to build the Android binaries and bindings,
run `make android_bindings`. Similarly, to only build the iOS binaries and
bindings, run `make ios_bindings`.


## Testing

Just run:

    cargo test
