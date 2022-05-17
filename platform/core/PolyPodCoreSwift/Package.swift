// swift-tools-version: 5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "PolyPodCoreSwift",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "PolyPodCoreSwift",
            targets: ["PolyPodCoreSwift"])
    ],
    dependencies: [
        .package(path: "../flatbuffers_shared/flatbuffers_v2.0.0/swift")
    ],
    targets: [
        .target(
            name: "PolyPodCoreSwift",
            dependencies: [
                .product(name: "FlatBuffers", package: "swift"),
                "PolyPodCore"
            ]
        ),
        .binaryTarget(name: "PolyPodCore",
                      path: "PolyPodCore.xcframework"),
        .testTarget(
            name: "PolyPodCoreSwiftTests",
            dependencies: ["PolyPodCoreSwift"])
    ]
)
