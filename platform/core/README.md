# PolyPod platform Kernel

Logic shared across polyPod implementations 

## Requirements
- [Rust toolchain](https://www.rust-lang.org/tools/install). Kernel is built with Rust 1.58.1.
- [Flatbuffers](https://formulae.brew.sh/formula/flatbuffers)

## Building

- When setting up the project for the first time or switching between branches, the flatbuffers models have to be generated:

        make generate_flatbuffers

- Build the project: 

        cargo build

## Testing

Just run:

        cargo test