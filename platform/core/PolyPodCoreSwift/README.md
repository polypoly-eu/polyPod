# PolyPodCoreSwift

A Swift wrapper around PolyPodCore Rust library. Encapsulates specific Pointer and Flatbuffer operations.

## Building

- Rust Core has to be built and exported as xcframework:
    - Run below command from the current directory:

             make -C .. ios_bindings

    - Or run this command from `core` directory:

             make ios_bindings

- Open `Package.swift` and build/test the package.
    
