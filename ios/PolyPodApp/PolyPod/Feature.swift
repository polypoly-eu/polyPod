//
//  Feature.swift
//  PolyPod
//
//  Created by Felix Dahlke on 13.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import Foundation
import UIKit

class Feature {
    let path: URL
    let name: String
    let author: String?
    let description: String?
    let primaryColor: UIColor?
    let thumbnail: URL?
    private let links: [String: String]

    static func load(path: URL) -> Feature? {
        let manifestPath = path.appendingPathComponent("manifest.json")
        guard let manifest = Manifest.load(path: manifestPath) else {
            print("Failed to load feature manifest from: \(manifestPath)")
            return nil
        }
        return Feature(path: path, manifest: manifest)
    }

    init(path: URL, manifest: Manifest) {
        self.path = path
        let userLanguage = Locale.current.languageCode ?? "en"
        let translations = manifest.translations?[userLanguage]
        name = translations?.name ?? manifest.name ?? path.lastPathComponent
        author = translations?.author ?? manifest.author
        description = translations?.description ?? manifest.description
        primaryColor = parseColor(hexValue: translations?.primaryColor ?? manifest.primaryColor)
        thumbnail = findThumbnail(
            featurePath: path,
            thumbnailPath: translations?.thumbnail ?? manifest.thumbnail
        )
        links = translations?.links ?? manifest.links ?? [:]
    }

    func findUrl(target: String) -> String? {
        if let url = links[target] {
            return url
        }
        if links.values.contains(target) {
            return target
        }
        return nil
    }

    struct Manifest: Decodable {
        let name: String?
        let author: String?
        let description: String?
        let thumbnail: String?
        let primaryColor: String?
        let links: [String: String]?
        let translations: [String: Override]?

        static func load(path: URL) -> Manifest? {
            guard let contents = try? String(contentsOf: path) else {
                return nil
            }
            guard let data = contents.data(using: .utf8) else {
                return nil
            }
            guard let manifest = try? JSONDecoder().decode(Manifest.self, from: data) else {
                return nil
            }
            return manifest
        }

        struct Override: Decodable {
            let name: String?
            let author: String?
            let description: String?
            let thumbnail: String?
            let primaryColor: String?
            let links: [String: String]?
        }
    }
}

private func parseColor(hexValue: String?) -> UIColor? {
    guard let hexValue = hexValue else {
        return nil
    }

    var rgbValue: UInt64 = 0
    let scanner = Scanner(string: hexValue)
    if let hashIndex = hexValue.firstIndex(of: "#") {
        scanner.currentIndex = hexValue.index(after: hashIndex)
    }
    let hexDigitCount = scanner.string.distance(from: scanner.currentIndex, to: scanner.string.endIndex)
    scanner.scanHexInt64(&rgbValue)

    switch hexDigitCount {
    case 6:
        return UIColor(red: CGFloat(rgbValue & 0xFF0000 >> 16) / 255,
                       green: CGFloat(rgbValue & 0xFF00 >> 8) / 255,
                       blue: CGFloat(rgbValue & 0xFF) / 255,
                       alpha: 1)
    case 8:
        return UIColor(red: CGFloat(rgbValue & 0xFF000000 >> 24) / 255,
                       green: CGFloat(rgbValue & 0xFF0000 >> 16) / 255,
                       blue: CGFloat(rgbValue & 0xFF00 >> 8) / 255,
                       alpha: CGFloat(rgbValue & 0xFF))
    default:
        print("Error: Unsupported color format in feature manifest: \(hexValue)")
        return nil
    }
}

private func findThumbnail(featurePath: URL, thumbnailPath: String?) -> URL? {
    guard let thumbnailPath = thumbnailPath else {
        return nil
    }
    let fullPath = featurePath.appendingPathComponent(thumbnailPath)
    if !FileManager.default.fileExists(atPath: fullPath.path) {
        print("Error: Feature thumbnail at \(thumbnailPath) does not exist")
        return nil
    }
    return fullPath
}
