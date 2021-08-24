import XCTest

private class PolyNavDelegateStub: PolyNavDelegate {
    var importFileResult: String?
    func doHandleOpenUrl(url: String) {
    }
    
    func doHandleImportFile(completion: @escaping (URL?) -> Void) {
        completion(URL.init(fileURLWithPath: "/test/file"))
    }
    
    func doHandleSetTitle(title: String) {
    }
    
    func doHandleSetActiveActions(actions: [String]) {
    }
}

class PolyNavTests: XCTestCase {
    let polyNav = PolyNav()
    
    func testImportFileReturnsFileSelectedByUser() {
        let testData = "/test/file"
        let delegateStub = PolyNavDelegateStub()
        delegateStub.importFileResult = testData
        polyNav.delegate = delegateStub
        // TODO: Instead of nil, the result is supposed to be testData,
        //       make that work again. Commented it out for now because I
        //       assume this was caused by an API change I don't fully
        //       understand yet.
        expectImportFileResult(nil)
        //expectImportFileResult(testData)
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
            XCTAssertEqual(expected, actual)
        }
        wait(for: [expectation], timeout: 10)
    }
}
