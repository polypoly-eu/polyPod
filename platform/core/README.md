# PolyPod platform core

Logic shared across polyPod platforms - ios, android, wasm.

## Requirements
- [Rust toolchain](https://www.rust-lang.org/tools/install). Core is built with Rust 1.58.1.
- The build prerequisites for [FlatBuffers](https://github.com/google/flatbuffers), currently primarily [CMake](https://cmake.org) and a C++ toolchain.

## Building

- When setting up the project for the first time or switching between branches, the flatbuffers models have to be generated:

        make generate_flatbuffers
    After models are generated, any changes to flatbuffers schema will trigger automatic update of the models when core is built.

- Build the project:

        cargo build

## Testing

Just run:

        cargo test
