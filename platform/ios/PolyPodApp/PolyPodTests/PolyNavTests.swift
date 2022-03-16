import XCTest
import Zip
@testable import PolyPod

private class PolyNavDelegateStub: PolyNavDelegate {
    var pickFileResult: ExternalFile?
    func doHandleOpenUrl(url: String) {
    }

    func doHandlePickFile(type: String?, completion: @escaping (ExternalFile?) -> Void) {
        completion(pickFileResult)
    }

    func doHandleSetTitle(title: String) {
    }

    func doHandleSetActiveActions(actions: [String]) {
    }
}
private let testFolderPath = FileManager.default.temporaryDirectory
    .appendingPathComponent("tests")
private let testFilePath = testFolderPath
    .appendingPathComponent("testFile.json")
private let testZipFileName = "testFile.zip"
private let testZipFilePath = testFolderPath.appendingPathComponent("testFile.zip")
private let zipMimeType = "application/zip"

private let testExternalFile = ExternalFile(url: testZipFilePath.absoluteString, name: testZipFileName, size: 12324)

private func removeTestFile() {
    let fileManager = FileManager.default
    if fileManager.fileExists(atPath: testFolderPath.path) {
        try! fileManager.removeItem(at: testFolderPath)
    }
}

private func createTestFile() {
    try! FileManager.default.createDirectory(at: testFolderPath, withIntermediateDirectories: true, attributes: nil)
    try! "".write(to: testFilePath, atomically: true, encoding: .utf8)
    let zipFilePath = try! Zip.quickZipFiles([testFilePath], fileName: "testFile")
    do {
        try FileManager.default.moveItem(at: zipFilePath, to: testZipFilePath)
    }
    catch (_) {

    }
}

class PolyNavTests: XCTestCase {
    let polyNav = PolyNav()

    override class func setUp() {
        createTestFile()
    }

    override class func tearDown() {
        removeTestFile()
    }

    func testPickFileReturnsFileSelectedByUser() {
        let delegateStub = PolyNavDelegateStub()
        delegateStub.pickFileResult = testExternalFile
        polyNav.delegate = delegateStub
        expectPickFileResult(testExternalFile)
    }

    func testPickFileReturnsNullIfUserCancelled() {
        let delegateStub = PolyNavDelegateStub()
        delegateStub.pickFileResult = nil
        polyNav.delegate = delegateStub
        expectPickFileResult(nil)
    }

    private func expectPickFileResult(_ expected: ExternalFile?) {
        let expectation = XCTestExpectation()
        polyNav.pickFile(type: zipMimeType) { actual in
            expectation.fulfill()
            guard let expected = expected else {
                XCTAssertEqual(nil, actual?.url)
                return
            }
            if let actual = actual {
                let start = actual.url.startIndex
                let end = actual.url.index(start, offsetBy: expected.url.count)
                XCTAssertEqual(expected.url, String(actual.url[start..<end]))
            } else {
                XCTAssertEqual(expected.url, nil)
            }
        }
        wait(for: [expectation], timeout: 10)
    }
}
