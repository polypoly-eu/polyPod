//
//  PreviewUtils.swift
//  PolyPod
//
//  Created by Felix Dahlke on 19.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

func createStubFeature(
    name: String,
    author: String? = nil,
    description: String? = nil,
    thumbnail: String? = nil,
    primaryColor: String? = nil,
    links: [String: String]? = nil
) -> Feature {
    let manifest = FeatureManifest(
        name: name,
        author: author,
        description: description,
        thumbnail: thumbnail,
        primaryColor: primaryColor,
        links: links,
        translations: nil
    )
    return Feature(
        path: URL(fileURLWithPath: ""),
        manifest: manifest
    )
}
