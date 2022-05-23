# PolyPod platform core

Logic shared across polyPod platforms - ios, android, wasm.

## Requirements

-   [Rust toolchain](https://www.rust-lang.org/tools/install). Core is built with Rust 1.58.1.
-   The build prerequisites for [FlatBuffers](https://github.com/google/flatbuffers), currently primarily a C++ toolchain.

## Building

It is required to run `make` in a bash terminal which contains the necessary dependencies - curl, make, unzip. MacOS and Linux systems terminal should already have everything needed. On Windows, a terminal like [GitBash](https://gitforwindows.org) is needed.

- Building rust core:
```
make rust_core
```

- Building swift core:
```
make ios_bindings
```

- Building android core:
```
make android_bindings
```

- Building for all platforms:
```
make
```

## Testing

Just run:

    cargo test
