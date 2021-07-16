import XCTest

private class PolyNavDelegateStub: PolyNavDelegate {
    var pickFileResult: Data?
    
    func doHandleOpenUrl(url: String) {
    }
    
    func doHandlePickFile(completion: @escaping (Data?) -> Void) {
        completion(pickFileResult)
    }
    
    func doHandleSetTitle(title: String) {
    }
    
    func doHandleSetActiveActions(actions: [String]) {
    }
}

class PolyNavTests: XCTestCase {
    let polyNav = PolyNav()
    
    func testPickFileReturnsFileSelectedByUser() {
        let testData = Data([0x01, 0x03, 0x03, 0x07])
        let delegateStub = PolyNavDelegateStub()
        delegateStub.pickFileResult = testData
        polyNav.delegate = delegateStub
        expectPickFileResult(testData)
    }
    
    func testPickFileReturnsNullIfUserCancelled() {
        let delegateStub = PolyNavDelegateStub()
        delegateStub.pickFileResult = nil
        polyNav.delegate = delegateStub
        expectPickFileResult(nil)
    }
    
    private func expectPickFileResult(_ expected: Data?) {
        let expectation = XCTestExpectation()
        polyNav.pickFile() { actual in
            expectation.fulfill()
            XCTAssertEqual(expected, actual)
        }
        wait(for: [expectation], timeout: 10)
    }
}
