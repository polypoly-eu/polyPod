import XCTest

var sessionGetData: Data?
var sessionPostData: Data?
var sessionError: Error?

class NetworkSessionMock: NetworkSession {
    func loadData(
        with request: URLRequest,
        completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void
    ) {
        let response = HTTPURLResponse(
            url: request.url!,
            statusCode: 200,
            httpVersion: "HTTP/1.1",
            headerFields: request.allHTTPHeaderFields
        )
        if request.httpMethod == "POST" {
            if request.httpBody != nil {
                completionHandler(sessionPostData, response, sessionError)
            } else {
                completionHandler(nil, response, URLError(.cancelled))
            }
        } else {
            completionHandler(sessionGetData, response, sessionError)
        }
    }
}

class PolyOutTests: XCTestCase {
    // swiftlint:disable empty_xctest_method
    override func setUp() {
        sessionGetData = nil
        sessionPostData = nil
        sessionError = nil
    }

    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
    }
    // swiftlint:enable empty_xctest_method

    func testPerformanceExample() {
        // This is an example of a performance test case.
        self.measure {
            // Put the code you want to measure the time of here.
        }
    }

    func testMakeHttpGetRequest_Valid() {
        let URL_STRING = "https://example.org/"

        let polyOut = PolyOut(session: NetworkSessionMock())

        let responseText = "This is the get response"
        sessionGetData = responseText.data(using: .utf8)

        let expectation = XCTestExpectation(description: "Test valid response")
        polyOut.fetch(
            urlString: URL_STRING,
            requestInit: FetchRequestInit(with: [:])) { (fetchResponse, _) in
            XCTAssertNotNil(fetchResponse, "fetchResponse is nil")

            XCTAssertEqual(fetchResponse!.url, URL_STRING)

            XCTAssertEqual(fetchResponse!.status, 200)

            XCTAssertEqual(fetchResponse!.bufferedText, responseText)

            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1.0)
    }

    func testMakeHttpGetRequest_Error() {
        let URL_STRING = "https://example.org/"

        let polyOut = PolyOut(session: NetworkSessionMock())

        sessionError = URLError(.unknown)

        let expectation = XCTestExpectation(description: "Test error")
        polyOut.fetch(
            urlString: URL_STRING,
            requestInit: FetchRequestInit(with: [:]),
            completionHandler: { (fetchResponse, _) in
                XCTAssertNil(fetchResponse, "fetchResponse is not nil")

                expectation.fulfill()
            })

        wait(for: [expectation], timeout: 1.0)
    }

    func testMakeHttpPostRequest_Valid() {
        let URL_STRING = "https://example.org/"

        let polyOut = PolyOut(session: NetworkSessionMock())

        let responseText = "This is the post response"
        sessionPostData = responseText.data(using: .utf8)
        let requestInitData = ["method": "post",
                               "body": "This is the body"]

        let expectation = XCTestExpectation(description: "Test valid response")
        polyOut.fetch(
            urlString: URL_STRING,
            requestInit: FetchRequestInit(with: requestInitData),
            completionHandler: { (fetchResponse, _) in
                XCTAssertNotNil(fetchResponse, "fetchResponse is nil")

                XCTAssertEqual(fetchResponse!.url, URL_STRING)

                XCTAssertEqual(fetchResponse!.status, 200)

                XCTAssertEqual(fetchResponse!.bufferedText, responseText)

                expectation.fulfill()
            })

        wait(for: [expectation], timeout: 1.0)
    }

    func testMakeHttpPostRequest_BodyMissing() {
        let URL_STRING = "https://example.org/"

        let polyOut = PolyOut(session: NetworkSessionMock())

        let responseText = "This is the post response"
        sessionPostData = responseText.data(using: .utf8)
        let requestInitData = ["method": "post"]

        let expectation = XCTestExpectation(description: "Test valid response")
        polyOut.fetch(
            urlString: URL_STRING,
            requestInit: FetchRequestInit(with: requestInitData),
            completionHandler: { (fetchResponse, _) in
                XCTAssertNil(fetchResponse, "fetchResponse is nil")

                expectation.fulfill()
            })

        wait(for: [expectation], timeout: 1.0)
    }

    func testMakeHttpPostRequest_Error() {
        let URL_STRING = "https://example.org/"

        let polyOut = PolyOut(session: NetworkSessionMock())

        sessionError = URLError(.unknown)
        let requestInitData = ["method": "post",
                               "body": "This is the body"]

        let expectation = XCTestExpectation(description: "Test error")
        polyOut.fetch(
            urlString: URL_STRING,
            requestInit: FetchRequestInit(with: requestInitData)) { (fetchResponse, _) in
            XCTAssertNil(fetchResponse, "fetchResponse is not nil")

            expectation.fulfill()
        }

        wait(for: [expectation], timeout: 1.0)
    }

    private func importArchive(url: String, destUrl: String? = nil, polyOut: PolyOut) -> String? {
        let expectation = expectation(description: "Exp")
        var newURL: String?
        polyOut.importArchive(url: url, destUrl: destUrl) { newUrl in
            newURL = newUrl
            expectation.fulfill()
        }
        wait(for: [expectation], timeout: 10.0)
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
        let polyOut = PolyOut(session: NetworkSessionMock())

        let bundle = Bundle(for: type(of: self))
        polyOut.activeFeature = Feature(
            path: URL(string: bundle.bundlePath)!,
            name: "Test",
            author: nil,
            description: nil,
            thumbnail: nil,
            thumbnailColor: nil,
            primaryColor: nil,
            links: nil,
            borderColor: nil,
            tileTextColor: nil
        )

        let url = bundle.url(forResource: "testZip", withExtension: "zip")!

        let newUrl = importArchive(url: url.absoluteString, destUrl: nil, polyOut: polyOut)
        XCTAssertTrue(newUrl != nil && !newUrl!.isEmpty, "newUrl is nil or empty")

        let (stuff, error) = readDir(url: newUrl!, polyOut: polyOut)
        XCTAssertNil(error, "error is not nil")
        XCTAssertTrue(stuff != nil && !stuff!.isEmpty, "no files were found")
        XCTAssertTrue(stuff!.contains { $0["path"] == "testZip/testfile.rtf" }, "file not found")
    }

    func testImportMultipleArchives() {
        let polyOut = PolyOut(session: NetworkSessionMock())

        let bundle = Bundle(for: type(of: self))
        polyOut.activeFeature = Feature(
            path: URL(string: bundle.bundlePath)!,
            name: "Test",
            author: nil,
            description: nil,
            thumbnail: nil,
            thumbnailColor: nil,
            primaryColor: nil,
            links: nil,
            borderColor: nil,
            tileTextColor: nil
        )

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
}
