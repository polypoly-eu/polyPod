import Foundation
import PolyPodCoreSwift
import SwiftUI

func createStubFeature(
    name: String,
    author: String? = nil,
    description: String? = nil,
    thumbnail: String? = nil,
    thumbnailColor: String = "#000000",
    primaryColor: String = "#000000",
    borderColor: String = "#000000",
    tileTextColor: String = "#000000",
    links: [String: String] = [:]
) -> Feature {
    Feature(
        path: URL(fileURLWithPath: ""),
        id: "id",
        name: name,
        author: author,
        description: description,
        primaryColor: primaryColor,
        thumbnailColor: thumbnailColor,
        thumbnail: thumbnail.flatMap(URL.init(string:)),
        borderColor: borderColor,
        tileTextColor: tileTextColor,
        links: links
    )
}
