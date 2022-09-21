import AppAuth
@testable import PolyPod
import Security
import XCTest

final class OIDAuthTests: XCTestCase {
    private lazy var redirectURL = URL(string: "coop.polypod.com://redirect")!
    private lazy var deepLinkURL = URL(string: redirectURL.absoluteString + "?code=1234")!
    private lazy var authRequest = OIDAuthorizationRequest(
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
    
    private lazy var tokenResponse: [String: Any] = [
        "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIi",
        "refresh_token": "SF3HYFQDHp90KKa4dqCAtNqQcAxs",
        "scope": "email audience",
        "token_type": "Bearer"
    ]
    
    override func setUp() {
        super.setUp()
        clearTokenStorage()
    }
    
    override func tearDown() {
        super.tearDown()
        clearTokenStorage()
    }
    
    private func clearTokenStorage() {
        let query = [kSecAttrService: authRequest.clientID,
                           kSecClass: kSecClassGenericPassword
                     ] as CFDictionary
        SecItemDelete(query)
    }

    func testStartsUserAgentWithCorrectRequest() throws {
        // Arrange
        let userAgent = OIDExternalUserAgentSpy()
        let auth = OIDAuth(authorizationRequest: authRequest, oidExternalUserAgent: userAgent)
        try stubTokenResponse()
        interceptRequests()

        // Act
        loadAuthState(auth)

        // Assert
        // Just assert that the proper AuthorizationRequest was sent to the UserAgent,
        // the rest should be properly handled by AppAuth SDK
        let performedRequest = userAgent.performedRequests.first! as! OIDAuthorizationRequest
        XCTAssertEqual(performedRequest, authRequest)
    }
    
    func testReturnsOAuthState() throws {
        // Arrange
        let auth = anyConfigFeatureAuth()
        
        try stubTokenResponse()
        interceptRequests()

        // Act
        loadAuthState(auth)
        
        let state = auth.state!
        XCTAssertEqual(state.lastTokenResponse?.accessToken, tokenResponse["access_token"] as? String)
        XCTAssertEqual(state.lastTokenResponse?.refreshToken, tokenResponse["refresh_token"] as? String)
        XCTAssertEqual(state.scope, tokenResponse["scope"] as? String)
        XCTAssertEqual(state.lastTokenResponse?.tokenType, tokenResponse["token_type"] as? String)
    }
    
    func testStoresAuthState() throws {
        // Arrange
        let auth = anyConfigFeatureAuth()
        try stubTokenResponse()
        interceptRequests()

        // Act
        loadAuthState(auth)
        
        let query = [kSecAttrService: "testFeature",
                           kSecClass: kSecClassGenericPassword,
                      kSecReturnData: true] as [CFString: Any]
        
        var result: AnyObject?
        _ = SecItemCopyMatching(query as CFDictionary, &result)
        
        let authState = try (result as? Data).map(OIDAuthState.decoded(from:))
        XCTAssertNotNil(authState)
        XCTAssertEqual(authState?.lastTokenResponse?.accessToken, tokenResponse["access_token"] as? String)
        XCTAssertEqual(authState?.lastTokenResponse?.refreshToken, tokenResponse["refresh_token"] as? String)
        XCTAssertEqual(authState?.scope, tokenResponse["scope"] as? String)
        XCTAssertEqual(authState?.lastTokenResponse?.tokenType, tokenResponse["token_type"] as? String)
    }
    
    func testUsesStoredToken() throws {
        let state = OIDAuthState.any
        let encoded = try state.encode()
        let query = [
            kSecValueData: encoded,
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: authRequest.clientID
        ] as CFDictionary
        _ = SecItemAdd(query, nil)
        
        let oauth = anyConfigFeatureAuth()
        loadAuthState(oauth)
      
        XCTAssertEqual(oauth.state?.scope, state.scope)
        XCTAssertEqual(oauth.state?.lastTokenResponse?.accessToken, state.lastTokenResponse?.accessToken)
        XCTAssertEqual(oauth.state?.lastTokenResponse?.refreshToken, state.lastTokenResponse?.refreshToken)
        XCTAssertEqual(oauth.state?.lastTokenResponse?.request.clientID, state.lastTokenResponse?.request.clientID)
    }
    
    func testClearAuthState() throws {
        // Arrange
        let auth = anyConfigFeatureAuth()
        try stubTokenResponse()
        interceptRequests()

        // Act
        loadAuthState(auth)
        auth.clearAuthState()
        
        let query = [kSecAttrService: authRequest.clientID,
                           kSecClass: kSecClassGenericPassword,
                      kSecReturnData: true] as [CFString: Any]
        
        var result: AnyObject?
        _ = SecItemCopyMatching(query as CFDictionary, &result)
        XCTAssertNil(result)
    }
    
    private func anyConfigFeatureAuth() -> OIDAuth {
        OIDAuth(authorizationRequest: authRequest, oidExternalUserAgent: OIDExternalUserAgentSpy())
    }
    
    private func loadAuthState(_ auth: OIDAuth) {
        let expectation = expectation(description: "wait for completion")
        auth.loadAuthState { _ in
            expectation.fulfill()
        }
        
        auth.handleAuthRedirect(deepLinkURL)
        wait(for: [expectation], timeout: 1.0)
    }

    private func stubTokenResponse() throws {
        let encoded = try JSONSerialization.data(withJSONObject: tokenResponse)
        NetworkRequestInterceptor.stub(.init(
            data: encoded,
            response: HTTPURLResponse.any200Response)
        )
    }
    private func interceptRequests() {
        OIDURLSessionProvider.setSession(
            URLSession(configuration:
                        NetworkRequestInterceptor.sessionConfigForIterception()
                      )
        )
        NetworkRequestInterceptor.startInterceptingRequests()
    }
    
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

extension URL {
    static var any: URL {
        URL(string: "https://any.com")!
    }
}

extension OIDTokenRequest {
    static var any: OIDTokenRequest {
        .init(configuration: .init(authorizationEndpoint: .any, tokenEndpoint: .any),
              grantType: OIDGrantTypeAuthorizationCode,
              authorizationCode: "123455",
              redirectURL: .any,
              clientID: "clientID",
              clientSecret: nil,
              scope: nil,
              refreshToken: "token",
              codeVerifier: nil,
              additionalParameters: nil)
    }
}

extension OIDAuthorizationRequest {
    static var any: OIDAuthorizationRequest {
        .init(
            configuration: .init(authorizationEndpoint: .any, tokenEndpoint: .any),
            clientId: "clientID",
            scopes: nil,
            redirectURL: .any,
            responseType: OIDResponseTypeCode,
            additionalParameters: nil)
    }
}

extension OIDAuthState {
    static var any: OIDAuthState {
        return OIDAuthState(
            authorizationResponse: .init(
                request: .any,
                parameters: [:]
            ),
            tokenResponse: .init(
                request: .any,
                parameters: [:]
            )
        )
    }
}
