# PolyPod platform Kernel

Logic shared across polyPod platforms - ios, android, wasm. 

## Requirements
- [Rust toolchain](https://www.rust-lang.org/tools/install). Kernel is built with Rust 1.58.1.
- [Flatbuffers](https://formulae.brew.sh/formula/flatbuffers). Kernel is built with Flatbuffers 2.1.1.

## Building

- When setting up the project for the first time or switching between branches, the flatbuffers models have to be generated:

        make generate_flatbuffers
    After models are generated, any changes to flatbuffers schema will trigger automatic update of the models when kernel is built.

- Build the project: 

        cargo build

## Testing

Just run:

        cargo test