# PolyPod platform core

Logic shared across polyPod platforms - ios, android, wasm.

## Requirements

-   [Rust toolchain](https://www.rust-lang.org/tools/install). Core is built with Rust 1.58.1.
-   The build prerequisites for [FlatBuffers](https://github.com/google/flatbuffers), currently primarily a C++ toolchain.

## Building

### With `make`:
- Set up and generate flatbuffers:
        make generate_flatbuffers
- Build the project:
          cargo build

### With `bash`:
- Set up flatbuffers:
          ./flatbuffers_shared/setup_flatbuffers.sh

- Generate flatbuffers:
          ./flatbuffers_shared/generate_flatbuffers.sh

- Build the project:

          cargo build

## Testing

Just run:

        cargo test
