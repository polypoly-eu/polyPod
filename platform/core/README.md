# PolyPod platform core

Logic shared across polyPod platforms - ios, android, wasm.

## Requirements

-   [Rust toolchain](https://www.rust-lang.org/tools/install). Core is built with Rust 1.58.1.
-   The build prerequisites for [FlatBuffers](https://github.com/google/flatbuffers), currently primarily a C++ toolchain.

## Building

On most systems, you can simply run `make`, and that will handle everything.
Note: On Windows you will have to use a bash terminal, like GitBash.

## Testing

Just run:

    cargo test
