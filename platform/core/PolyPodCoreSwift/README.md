# PolyPodCoreSwift

A Swift wrapper around PolyPodCore Rust library. Encapsulates specific Pointer and Flatbuffer operations.

## Building

- Rust Core has to be built and exported as xcframework:
    - Run below command from the current directory:

             make -C .. build_ios_xcframework

    - Or run this command from `core` directory:

             make build_ios_xcframework

- Open `Package.swift` and build/test the package.
    
