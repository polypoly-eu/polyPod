import SwiftUI
import XCTest

private let fixturesPath = FileManager.default.temporaryDirectory
    .appendingPathComponent("feature-fixtures")

private func removeFixturesDirectory() {
    let fileManager = FileManager.default
    if fileManager.fileExists(atPath: fixturesPath.path) {
        try! fileManager.removeItem(at: fixturesPath)
    }
}

private func createFixture(
    withThumbnail: Bool = false,
    color: String = "#0000ff"
) -> Feature {
    let featurePath = fixturesPath.appendingPathComponent(
        ProcessInfo.processInfo.globallyUniqueString
    )
    try! FileManager.default.createDirectory(
        at: featurePath,
        withIntermediateDirectories: true
    )
    
    let thumbnailFileName = "thumbnail.png"
    if withThumbnail {
        let thumbnailPath =
            featurePath.appendingPathComponent(thumbnailFileName)
        try! "".write(to: thumbnailPath, atomically: true, encoding: .utf8)
    }
    
    let manifestPath = featurePath.appendingPathComponent("manifest.json")
    let manifest = """
    {
        "name": "name",
        "author": "author",
        "description": "description",
        "thumbnail": "\(withThumbnail ? thumbnailFileName : "")",
        "primaryColor": "\(color)",
        "links": {
            "example": "https://example.com",
            "uk-example": "https://example.co.uk"
        }
    }
    """
    try! manifest.write(to: manifestPath, atomically: true, encoding: .utf8)
    
    let feature = Feature.load(path: featurePath)
    XCTAssertNotNil(feature, "Feature failed to load - invalid JSON?")
    return feature!
}

class FeatureTests: XCTestCase {
    override class func setUp() {
        removeFixturesDirectory()
    }
    
    override class func tearDown() {
        removeFixturesDirectory()
    }
    
    func testPropertyAccessWorks() {
        let feature = createFixture()
        XCTAssertEqual("name", feature.name)
    }
    
    func testLinkLookupByTargetWorks() {
        let feature = createFixture()
        XCTAssertEqual(
            "https://example.com",
            feature.findUrl(target: "example")
        )
    }

    func testLinkLookupByUrlWorks() {
        let feature = createFixture()
        XCTAssertEqual(
            "https://example.com",
            feature.findUrl(target: "https://example.com")
        )
    }
    
    func testColorParsedCorrectly() {
        let feature = createFixture()
        XCTAssertEqual(Color(red: 0, green: 0, blue: 1), feature.primaryColor)
    }

    func testInvalidColorIgnored() {
        let feature = createFixture(color: "grun!")
        XCTAssertEqual(Color.clear, feature.primaryColor)
    }
    
    func testThumbnailUrlMissing() {
        let feature = createFixture(withThumbnail: false)
        XCTAssertNil(feature.thumbnail)
    }
    
    func testThumbnailUrlValid() {
        let feature = createFixture(withThumbnail: true)
        XCTAssertEqual("thumbnail.png", feature.thumbnail?.lastPathComponent)
    }
}
