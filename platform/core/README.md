# PolyPod platform core

This is the workspace containing the logic shared across polyPod platforms: iOS/Android/Web.

## Structure:

This Rust repository follows the [Cargo Workspace](https://doc.rust-lang.org/cargo/reference/workspaces.html) structure, as follows:

- [lib](lib): The top level library that composes together the necessary functionalities.
- [ffi](ffi): The library meant for exporting the `core` to be used in non Rust environments, such as iOS/Android/Web.
- [crates](crates): The many small libraries that implement a specific functionality, which are then composed in [lib](lib).

## Adding new functionality

- Start by adding a new crate in [crates](crates).
- If it is just a supporting crate for other crates, just integrate it with target crates.
- If the new crate functionality needs to be exposed to the platforms:
    - Integrate it properly in [lib](lib).
    - Update [ffi](ffi) to properly export the functionality to the platforms.

## Requirements

- [Rust toolchain](https://www.rust-lang.org/tools/install). Core is built with Rust 1.63.0.

## Building


- Building the whole workspace:
```shell
cargo build
```

- Building a specific crate:
```shell
cargo build -p <crate name>
```

## Building for platforms

It is required to run `make` in a bash terminal. MacOS and Linux systems terminal should
already have everything needed. On Windows, a terminal application like
[GitBash](https://gitforwindows.org) is needed.

- Building core for ios:
```shell
make ios_bindings
```

- Building core for android:

    Prerequisite: You should install NDK (it is recommended to use Android Studio for installing it). Version r25 should be installed. Make sure that either `NDK_HOME` or `ANDROID_NDK_HOME`(specifying the path to NDK) is exported as an environment variable on your system.

```shell
make android_bindings
```

- Building for all platforms:

```shell
make
```

## Testing

Just run:

    cargo test

## Debugging

By default core is not built with debugging symbols for the means of optimizing the build performance. When it is needed to have the core built with debug symbols, consider changing the `debug` entry in Cargo.toml to appropriate value.
