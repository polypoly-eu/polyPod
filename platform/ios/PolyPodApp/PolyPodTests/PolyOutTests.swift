import PolyPodCoreSwift
import XCTest

var sessionGetData: Data?
var sessionPostData: Data?
var sessionError: Error?

class PolyOutTests: XCTestCase {
    // swiftlint:disable empty_xctest_method
    override func setUp() {
        sessionGetData = nil
        sessionPostData = nil
        sessionError = nil
    }

    private func importArchive(url: String, destUrl: String? = nil, polyOut: PolyOut) -> String? {
        let expectation = expectation(description: "Exp")
        var newURL: String?
        polyOut.importArchive(url: url, destUrl: destUrl) { newUrl in
            newURL = newUrl
            expectation.fulfill()
        }
        wait(for: [expectation], timeout: 40.0)
        return newURL
    }

    private func readDir(url: String, polyOut: PolyOut) -> ([[String: String]]?, Error?) {
        let expectation = expectation(description: "Exp")
        var _stuff: [[String: String]]?
        var _error: Error?
        polyOut.readDir(url: url) { stuff, error in
            _stuff = stuff
            _error = error
            expectation.fulfill()
        }
        wait(for: [expectation], timeout: 10.0)
        return (_stuff, _error)
    }

    func testImportOneArchive() {
        let polyOut = PolyOut()

        let bundle = Bundle(for: type(of: self))
        polyOut.activeFeature = createFeature(path: URL(string: bundle.bundlePath)!)

        let url = bundle.url(forResource: "testZip", withExtension: "zip")!

        let newUrl = importArchive(url: url.absoluteString, destUrl: nil, polyOut: polyOut)
        XCTAssertTrue(newUrl != nil && !newUrl!.isEmpty, "newUrl is nil or empty")

        let (stuff, error) = readDir(url: newUrl!, polyOut: polyOut)
        XCTAssertNil(error, "error is not nil")
        XCTAssertTrue(stuff != nil && !stuff!.isEmpty, "no files were found")
        XCTAssertTrue(stuff!.contains { $0["path"] == "testZip/testfile.rtf" }, "file not found")
    }

    func testImportMultipleArchives() {
        let polyOut = PolyOut()

        let bundle = Bundle(for: type(of: self))
        polyOut.activeFeature = createFeature(path: URL(string: bundle.bundlePath)!)
        let url1 = bundle.url(forResource: "multipleZips1", withExtension: "zip")!
        let url2 = bundle.url(forResource: "multipleZips2", withExtension: "zip")!

        let newUrl1 = importArchive(url: url1.absoluteString, destUrl: nil, polyOut: polyOut)
        XCTAssertTrue(newUrl1 != nil && !newUrl1!.isEmpty, "newUrl1 is nil or empty")

        let newUrl2 = importArchive(url: url2.absoluteString, destUrl: newUrl1, polyOut: polyOut)
        XCTAssertTrue(newUrl2 != nil && !newUrl2!.isEmpty, "newUrl2 is nil or empty")
        XCTAssertTrue(newUrl1 == newUrl2)

        let (stuff, error) = readDir(url: newUrl1!, polyOut: polyOut)
        XCTAssertNil(error, "error is not nil")
        XCTAssertTrue(stuff != nil && !stuff!.isEmpty, "no files were found")
        XCTAssertTrue(stuff!.contains { $0["path"] == "multipleZips1/file1.rtf" }, "file1  not found")
        XCTAssertTrue(stuff!.contains { $0["path"] == "multipleZips2/file2.rtf" }, "file2  not found")
    }
    
    private func createFeature(path: URL) -> Feature {
        Feature(
            path: path,
            id: "Test",
            name: "name",
            author: nil,
            description: nil,
            primaryColor: "color",
            thumbnailColor: "color",
            thumbnail: nil,
            borderColor: "color",
            tileTextColor: "color",
            links: [:]
        )
    }
}
