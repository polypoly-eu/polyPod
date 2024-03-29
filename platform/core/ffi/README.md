# FFI bindings for the core

This crate implements the necessary functionality to export the `core` API to platforms such as iOS/Android/Web.

## Structure

- [c_interface](src/c_interface): Creates a C compatible API for the `core`.
- [java_interface](src/java_interface): Creates the JVM compatible API for the `core`.

## Building

This crate is meant to be built for specific architectures. Currently supported are iOS and Android.

- Building for iOS:
```shell
rustup target add aarch64-apple-ios
cargo build --target aarch64-apple-ios
```

- Building for Android:
```shell
cargo install cargo-ndk
rustup target add aarch64-linux-android
cargo ndk --platform 24 --target aarch64-linux-android build
```
