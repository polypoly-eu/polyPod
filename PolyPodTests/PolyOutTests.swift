//
//  PolyOutTests.swift
//  PolyPodTests
//
//  Created by Carmen Burmeister on 12.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import XCTest

var sessionData: Data?
var sessionError: Error?

class NetworkSessionMock: NetworkSession {

    func loadData(with request: URLRequest, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) {
        let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: [:])
        completionHandler(sessionData, response, sessionError)
    }
}

class PolyOutTests: XCTestCase {

    override func setUp() {
        // Put setup code here. This method is called before the invocation of each test method in the class.
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
    
    func testMakeHttpRequest() {
        let URL_STRING = "https://example.org/"
        
        let polyOut = PolyOut(session: NetworkSessionMock())
        
        let expectationValid = XCTestExpectation(description: "Test valid response")
        sessionError = nil
        let responseText = "This is the response"
        sessionData = responseText.data(using: .utf8)
        
        polyOut.makeHttpRequest(urlString: URL_STRING, requestInit: FetchRequestInit(initData: [:]), completionHandler: { fetchResponse in
            XCTAssertNotNil(fetchResponse, "fetchResponse is nil")
            
            XCTAssertEqual(fetchResponse!.url, URL_STRING)
            
            XCTAssertEqual(fetchResponse!.status, 200)
            
            XCTAssertEqual(fetchResponse!.bufferedText, responseText)
            
            expectationValid.fulfill()
        })
        
        wait(for: [expectationValid], timeout: 1.0)
        
        sessionError = URLError(.badURL)
        sessionData = nil
        let expectationError = XCTestExpectation(description: "Test error")
        
        polyOut.makeHttpRequest(urlString: URL_STRING, requestInit: FetchRequestInit(initData: [:]), completionHandler: { fetchResponse in
            XCTAssertNil(fetchResponse, "fetchResponse is not nil")
            
            expectationError.fulfill()
        })
        
        wait(for: [expectationError], timeout: 1.0)
    }

}
