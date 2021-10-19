import XCTest
import Zip

private class PolyNavDelegateStub: PolyNavDelegate {
    var importFileResult: URL?
    func doHandleOpenUrl(url: String) {
    }
    
    func doHandleImportFile(completion: @escaping (URL?) -> Void) {
        completion(importFileResult)
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
private let testZipFilePath = testFolderPath.appendingPathComponent("testFile.zip")

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
    
    func testImportFileReturnsFileSelectedByUser() {
        let delegateStub = PolyNavDelegateStub()
        delegateStub.importFileResult = testZipFilePath
        polyNav.delegate = delegateStub
        expectImportFileResult("polypod://")
    }
    
    func testImportFileReturnsNullIfUserCancelled() {
        let delegateStub = PolyNavDelegateStub()
        delegateStub.importFileResult = nil
        polyNav.delegate = delegateStub
        expectImportFileResult(nil)
    }
    
    private func expectImportFileResult(_ expected: String?) {
        let expectation = XCTestExpectation()
        polyNav.importFile() { actual in
            expectation.fulfill()
            if expected == nil {
                XCTAssertEqual(expected, actual)
            }
            else if let actual = actual {
                let start = actual.startIndex
                let end = actual.index(start, offsetBy: expected!.count)
                XCTAssertEqual(expected, String(actual[start..<end]))
            }
        }
        wait(for: [expectation], timeout: 10)
    }
}
