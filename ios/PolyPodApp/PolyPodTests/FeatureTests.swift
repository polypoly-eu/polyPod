import SwiftUI
import XCTest

class FeatureTests: XCTestCase {
    func testPropertyAccessWorks() {
        let feature = createFeatureFixture()
        XCTAssertEqual("name", feature.name)
    }
    
    func testLinkLookupByTargetWorks() {
        let feature = createFeatureFixture()
        XCTAssertEqual(
            "https://example.com",
            feature.findUrl(target: "example")
        )
    }

    func testLinkLookupByUrlWorks() {
        let feature = createFeatureFixture()
        XCTAssertEqual(
            "https://example.com",
            feature.findUrl(target: "https://example.com")
        )
    }
    
    func testTranslatedPropertyAccessWorks() {
        let feature = createFeatureFixture(languageCode: "de")
        XCTAssertEqual("description_de", feature.description)
    }

    func testTranslatedLinkAccessWorks() {
        let feature = createFeatureFixture(languageCode: "de")
        XCTAssertEqual(
            "https://example.de",
            feature.findUrl(target: "example")
        )
    }
    
    func testColorParsedCorrectly() {
        let feature = createFeatureFixture()
        XCTAssertEqual(Color(red: 0, green: 0, blue: 1), feature.primaryColor)
    }

    func testInvalidColorIgnored() {
        let feature = createFeatureFixture(languageCode: "de")
        XCTAssertEqual(Color.clear, feature.primaryColor)
    }
    
    private func createFeatureFixture(languageCode: String? = nil) -> Feature {
        let fileManager = FileManager.default
        let featurePath = fileManager
            .temporaryDirectory
            .appendingPathComponent("featureFixture")
        if fileManager.fileExists(atPath: featurePath.path) {
            try! fileManager.removeItem(at: featurePath)
        }
        try! fileManager.createDirectory(
            at: featurePath,
            withIntermediateDirectories: false
        )
        
        let manifestPath = featurePath.appendingPathComponent("manifest.json")
        let manifest = """
        {
            "name": "name",
            "author": "author",
            "description": "description",
            "thumbnail": "",
            "primaryColor": "#0000ff",
            "links": { "example": "https://example.com" },
            "translations": {
                "de": {
                    "description": "description_de",
                    "primaryColor": "grün!",
                    "links": { "example": "https://example.de" }
                }
            }
        }
        """
        try! manifest.write(
            to: manifestPath,
            atomically: true,
            encoding: .utf8
        )
        
        let feature = Feature.load(
            path: featurePath,
            languageCode: languageCode
        )
        XCTAssertNotNil(feature, "Feature failed to load - invalid JSON?")
        return feature!
    }
}

