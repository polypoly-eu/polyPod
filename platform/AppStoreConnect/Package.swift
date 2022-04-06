// swift-tools-version:5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "AppStoreConnect",
    platforms: [.macOS(.v11)],
    products: [
        .executable(name: "AppStoreConnectCMD", targets: ["AppStoreConnectCMD"])
    ],
    dependencies: [
        .package(url: "https://github.com/polypoly-eu/appstoreconnect-swift-sdk", from: "1.7.0"),
        .package(url: "https://github.com/apple/swift-argument-parser", from: "1.1.1")
    ],
    targets: [
        .target(
            name: "AppStoreConnect",
            dependencies: [.product(name: "AppStoreConnect-Swift-SDK", package: "AppStoreConnect-Swift-SDK")]),
        .executableTarget(name: "AppStoreConnectCMD",
                          dependencies: [
                            "AppStoreConnect",
                            .product(name: "AppStoreConnect-Swift-SDK", package: "AppStoreConnect-Swift-SDK"),
                            .product(name: "ArgumentParser", package: "swift-argument-parser")
                          ]),
        .testTarget(
            name: "AppStoreConnectTests",
            dependencies: ["AppStoreConnect"]),
    ]
)
