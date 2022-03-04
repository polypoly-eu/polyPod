import XCTest

var sessionGetData: Data?
var sessionPostData: Data?
var sessionError: Error?

class NetworkSessionMock: NetworkSession {
    func loadData(with request: URLRequest, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) {
        let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: request.allHTTPHeaderFields)
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
        polyOut.fetch(urlString: URL_STRING, requestInit: FetchRequestInit(with: [:]), completionHandler: { (fetchResponse, error) in
            XCTAssertNotNil(fetchResponse, "fetchResponse is nil")
            
            XCTAssertEqual(fetchResponse!.url, URL_STRING)
            
            XCTAssertEqual(fetchResponse!.status, 200)
            
            XCTAssertEqual(fetchResponse!.bufferedText, responseText)
            
            expectation.fulfill()
        })
        
        wait(for: [expectation], timeout: 1.0)
    }
    
    func testMakeHttpGetRequest_Error() {
        let URL_STRING = "https://example.org/"
        
        let polyOut = PolyOut(session: NetworkSessionMock())
        
        sessionError = URLError(.unknown)
        
        let expectation = XCTestExpectation(description: "Test error")
        polyOut.fetch(urlString: URL_STRING, requestInit: FetchRequestInit(with: [:]), completionHandler: { (fetchResponse, error) in
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
        let requestInitData = ["method" : "post",
                               "body" : "This is the body"]
        
        let expectation = XCTestExpectation(description: "Test valid response")
        polyOut.fetch(urlString: URL_STRING, requestInit: FetchRequestInit(with: requestInitData), completionHandler: { (fetchResponse, error) in
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
        let requestInitData = ["method" : "post"]
        
        let expectation = XCTestExpectation(description: "Test valid response")
        polyOut.fetch(urlString: URL_STRING, requestInit: FetchRequestInit(with: requestInitData), completionHandler: { (fetchResponse, error) in
            XCTAssertNil(fetchResponse, "fetchResponse is nil")
            
            expectation.fulfill()
        })
        
        wait(for: [expectation], timeout: 1.0)
    }
    
    func testMakeHttpPostRequest_Error() {
        let URL_STRING = "https://example.org/"
        
        let polyOut = PolyOut(session: NetworkSessionMock())
        
        sessionError = URLError(.unknown)
        let requestInitData = ["method" : "post",
                               "body" : "This is the body"]
        
        let expectation = XCTestExpectation(description: "Test error")
        polyOut.fetch(urlString: URL_STRING, requestInit: FetchRequestInit(with: requestInitData), completionHandler: { (fetchResponse, error) in
            XCTAssertNil(fetchResponse, "fetchResponse is not nil")
            
            expectation.fulfill()
        })
        
        wait(for: [expectation], timeout: 1.0)
    }
}
