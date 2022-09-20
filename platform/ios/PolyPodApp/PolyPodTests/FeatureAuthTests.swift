// Please remove this line and the empty one after it

import XCTest
import AppAuth
import Security
@testable import PolyPod

private final class OIDExternalUserAgentSpy: NSObject, OIDExternalUserAgent {
    
    /// The requests that were performed
    private(set) var performedRequests = [OIDExternalUserAgentRequest]()
    
    func present(_ request: OIDExternalUserAgentRequest, session: OIDExternalUserAgentSession) -> Bool {
        performedRequests.append(request)
        return true
    }
    
    func dismiss(animated: Bool, completion: @escaping () -> Void) {
        completion()
    }
}


final class OIDAuthTests: XCTestCase {
    lazy var redirectURL = URL(string: "coop.polypod.com://redirect")!
    lazy var deepLinkURL = URL(string: redirectURL.absoluteString + "?code=1234")!
    lazy var authRequest = OIDAuthorizationRequest(
        configuration: .init(
            authorizationEndpoint: URL(string: "https://anyAuth.com")!,
            tokenEndpoint: URL(string: "https://anyToken.com")!
        ),
        clientId: "clientId",
        clientSecret: nil,
        scope: nil,
        redirectURL: redirectURL,
        responseType: OIDResponseTypeCode,
        state: nil,
        nonce: nil,
        codeVerifier: nil,
        codeChallenge: nil,
        codeChallengeMethod: nil,
        additionalParameters: nil)
    
    override func setUp() {
        super.setUp()
        clearTokenStorage()
    }
    
    override func tearDown() {
        super.tearDown()
        clearTokenStorage()
    }
    
    func clearTokenStorage() {
        let query = [kSecAttrService: authRequest.clientID,
                           kSecClass: kSecClassGenericPassword
                     ] as CFDictionary
        SecItemDelete(query)
    }

    func testStartsUserAgentWithCorrectRequest() throws {
        // Arrange
        let userAgent = OIDExternalUserAgentSpy()
        let auth = OIDAuth(authorizationRequest: authRequest, oidExternalUserAgent: userAgent)
        
        let response: [String: Any] = [
            "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIi",
            "refresh_token": "SF3HYFQDHp90KKa4dqCAtNqQcAxs",
            "scope": "email audience",
            "token_type": "Bearer"
        ]
        
        let encoded = try JSONSerialization.data(withJSONObject: response)
        NetworkRequestInterceptor.stub(.init(
            data: encoded,
            response: HTTPURLResponse.any200Response)
        )
        interceptRequests()
        // Act
        let expectation = expectation(description: "wait for completion")
        auth.loadAuthState { _ in
            expectation.fulfill()
        }
        wait(for: [expectation], timeout: 1.0)
        auth.handleAuthRedirect(deepLinkURL)
        
        // Assert
        // Just assert that the proper AuthorizationRequest was sent to the UserAgent,
        // the rest should be properly handled by AppAuth SDK
        let performedRequest = userAgent.performedRequests.first! as! OIDAuthorizationRequest
        XCTAssertEqual(performedRequest, authRequest)
    }
    
    func testReturnsOAuthState() throws {
        // Arrange
        let auth = anyConfigFeatureAuth()

        let response: [String: Any] = [
            "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIi",
            "refresh_token": "SF3HYFQDHp90KKa4dqCAtNqQcAxs",
            "scope": "email audience",
            "token_type": "Bearer"
        ]
        
        let encoded = try JSONSerialization.data(withJSONObject: response)
        NetworkRequestInterceptor.stub(.init(
            data: encoded,
            response: HTTPURLResponse.any200Response)
        )
        interceptRequests()

        // Act
        let expectation = expectation(description: "wait for completion")
        auth.loadAuthState { result in
            expectation.fulfill()
        }
        
        auth.handleAuthRedirect(redirectURL)
        wait(for: [expectation], timeout: 1.0)
        let state = auth.state!
        XCTAssertEqual(state.lastTokenResponse?.accessToken, response["access_token"] as? String)
        XCTAssertEqual(state.lastTokenResponse?.refreshToken, response["refresh_token"] as? String)
        XCTAssertEqual(state.scope, response["scope"] as? String)
        XCTAssertEqual(state.lastTokenResponse?.tokenType, response["token_type"] as? String)
    }
    
    func testStoresAuthState() throws {
        // Arrange
        let auth = anyConfigFeatureAuth()
        
        let response: [String: Any] = [
            "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIi",
            "refresh_token": "SF3HYFQDHp90KKa4dqCAtNqQcAxs",
            "scope": "email audience",
            "token_type": "Bearer"
        ]
        
        let encoded = try JSONSerialization.data(withJSONObject: response)
        NetworkRequestInterceptor.stub(.init(
            data: encoded,
            response: HTTPURLResponse.any200Response)
        )
        interceptRequests()

        // Act
        let expectation = expectation(description: "wait for completion")
        auth.loadAuthState { _ in
            expectation.fulfill()
        }
        
        auth.handleAuthRedirect(redirectURL)
        wait(for: [expectation], timeout: 1.0)
        
        let query = [kSecAttrService: "testFeature",
                           kSecClass: kSecClassGenericPassword,
                      kSecReturnData: true] as [CFString: Any]
        
        var result: AnyObject?
        _ = SecItemCopyMatching(query as CFDictionary, &result)
        
        let authState = try (result as? Data).map(OIDAuthState.decoded(from:))
        XCTAssertNotNil(authState)
        XCTAssertEqual(authState?.lastTokenResponse?.accessToken, response["access_token"] as? String)
        XCTAssertEqual(authState?.lastTokenResponse?.refreshToken, response["refresh_token"] as? String)
        XCTAssertEqual(authState?.scope, response["scope"] as? String)
        XCTAssertEqual(authState?.lastTokenResponse?.tokenType, response["token_type"] as? String)
    }
    
    private func anyConfigFeatureAuth() -> OIDAuth {
        OIDAuth(authorizationRequest: authRequest, oidExternalUserAgent: OIDExternalUserAgentSpy())
    }
    
    private func interceptRequests() {
        OIDURLSessionProvider.setSession(
            URLSession(configuration:
                        NetworkRequestInterceptor.sessionConfigForIterception()
                      )
        )
        NetworkRequestInterceptor.startInterceptingRequests()
    }
}

extension HTTPURLResponse {
    static var any200Response: HTTPURLResponse {
        HTTPURLResponse(
            url: URL(string: "https://any.com")!,
            statusCode: 200,
            httpVersion: nil,
            headerFields: nil
        )!
    }
}
extension NSError {
    static var any: NSError {
        NSError(domain: "test", code: 1)
    }
}
