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
        manifest: manifest,
        languageCode: nil
    )
}
