import SwiftUI
import XCTest

class FeatureTests: XCTestCase {
    func testPropertyAccessWorks() {
        let feature = createFeature()
        XCTAssertEqual("name", feature.name)
    }
    
    func testLinkLookupByTargetWorks() {
        let feature = createFeature()
        XCTAssertEqual(
            "https://example.com",
            feature.findUrl(target: "example")
        )
    }

    func testLinkLookupByUrlWorks() {
        let feature = createFeature()
        XCTAssertEqual(
            "https://example.com",
            feature.findUrl(target: "https://example.com")
        )
    }
    
    func testTranslatedPropertyAccessWorks() {
        let feature = createFeature(languageCode: "de")
        XCTAssertEqual("description_de", feature.description)
    }

    func testTranslatedLinkAccessWorks() {
        let feature = createFeature(languageCode: "de")
        XCTAssertEqual(
            "https://example.de",
            feature.findUrl(target: "example")
        )
    }
    
    func testColorParsedCorrectly() {
        let feature = createFeature()
        XCTAssertEqual(Color(red: 0, green: 0, blue: 1), feature.primaryColor)
    }

    func testInvalidColorIgnored() {
        let feature = createFeature(languageCode: "de")
        XCTAssertEqual(Color.clear, feature.primaryColor)
    }
    
    private func createFeature(languageCode: String? = nil) -> Feature {
        let manifest = FeatureManifest(
            name: "name",
            author: "author",
            description: "description",
            thumbnail: "",
            primaryColor: "#0000ff",
            links: ["example": "https://example.com"],
            translations: [
                "de": FeatureManifest.Override(
                    description: "description_de",
                    primaryColor: "grün!",
                    links: ["example": "https://example.de"]
                )
            ]
        )
        let path = URL(string: "file:///")!
        return Feature(
            path: path,
            manifest: manifest,
            languageCode: languageCode
        )
    }
}

