// Please remove this line and the empty one after it

import XCTest
import AppAuth
import Security
@testable import PolyPod

class CustomUserAgent: NSObject, OIDExternalUserAgent {
    var performedRequests = [OIDExternalUserAgentRequest]()
    func present(_ request: OIDExternalUserAgentRequest, session: OIDExternalUserAgentSession) -> Bool {
        performedRequests.append(request)
        return true
    }
    
    func dismiss(animated: Bool, completion: @escaping () -> Void) {
        completion()
    }
}

final class FeatureAuthTests: XCTestCase {
    func testStartsUserAgentWithCorrectRequest() {
        // Arrange
        let service = "testFeature"
        let config = OIDAuthConfig(authEndpoint: URL(string: "https://authEndpoint")!,
                                   tokenEndpoint: URL(string: "https://tokenEndpoint")!,
                                   clientId: "testClientId",
                                   redirectURL: URL(string: "coop.polypodtest.com://redirect")!)
        let auth = FeatureOIDAuth(service: service, config: config)
        let userAgent = CustomUserAgent()
        auth.externalUserAgent = userAgent
        
        // Act
        let expectation = expectation(description: "wait for completion")
        auth.getAuthState { _ in
            expectation.fulfill()
        }
        
        auth.handleAuthRedirect(URL(string: "coop.polypodtest.com://redirect?code=1234")!)
        wait(for: [expectation], timeout: 1.0)

        // Assert
        // Just assert that the proper AuthorizationRequest was sent to the UserAgent,
        // the rest should be properly handled by AppAuth SDK
        let performedRequest = userAgent.performedRequests.first! as! OIDAuthorizationRequest
        XCTAssertEqual(
            performedRequest.configuration.tokenEndpoint,
            config.tokenEndpoint
        )
        XCTAssertEqual(
            performedRequest.configuration.authorizationEndpoint,
            config.authEndpoint
        )
        XCTAssertEqual(performedRequest.clientID, config.clientId)
        XCTAssertNil(performedRequest.clientSecret)
        XCTAssertEqual(
            performedRequest.scope,
            OIDScopeUtilities.scopes(with: [OIDScopeEmail, OIDScopeOpenID])
        )
        XCTAssertEqual(performedRequest.redirectURL, config.redirectURL)
        XCTAssertEqual(performedRequest.responseType, OIDResponseTypeCode)
        XCTAssertNil(performedRequest.state)
        XCTAssertNil(performedRequest.nonce)
        XCTAssertNotNil(performedRequest.codeVerifier)
        XCTAssertNotNil(performedRequest.codeChallenge)
        XCTAssertEqual(performedRequest.codeChallengeMethod, OIDOAuthorizationRequestCodeChallengeMethodS256)
        XCTAssertEqual(performedRequest.additionalParameters, [:])
    }
    
    func testReturnsOAuthState() throws {
        // Arrange
        let auth = anyConfigFeatureAuth()
        auth.urlSession = URLSession(
            configuration: NetworkRequestInterceptor.sessionConfigForIterception()
        )
        
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
        NetworkRequestInterceptor.startInterceptingRequests()

        // Act
        let expectation = expectation(description: "wait for completion")
        var capturedResult: Result<OIDAuthState, Error>!
        auth.getAuthState { result in
            capturedResult = result
            expectation.fulfill()
        }
        
        auth.handleAuthRedirect(URL(string: "coop.polypodtest.com://redirect?code=1234")!)
        wait(for: [expectation], timeout: 1.0)
        let state = try capturedResult.get()
        XCTAssertEqual(state.lastTokenResponse?.accessToken, response["access_token"] as? String)
        XCTAssertEqual(state.lastTokenResponse?.refreshToken, response["refresh_token"] as? String)
        XCTAssertEqual(state.scope, response["scope"] as? String)
        XCTAssertEqual(state.lastTokenResponse?.tokenType, response["token_type"] as? String)
    }
    
    func testStoresAuthState() throws {
        // Arrange
        let auth = anyConfigFeatureAuth()
        auth.urlSession = URLSession(
            configuration: NetworkRequestInterceptor.sessionConfigForIterception()
        )
        
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
        NetworkRequestInterceptor.startInterceptingRequests()

        // Act
        let expectation = expectation(description: "wait for completion")
        auth.getAuthState { _ in
            expectation.fulfill()
        }
        
        auth.handleAuthRedirect(URL(string: "coop.polypodtest.com://redirect?code=1234")!)
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
    
    func anyConfigFeatureAuth() -> FeatureOIDAuth {
        let service = "testFeature"
        let config = OIDAuthConfig(authEndpoint: URL(string: "https://authEndpoint")!,
                                   tokenEndpoint: URL(string: "https://tokenEndpoint")!,
                                   clientId: "testClientId",
                                   redirectURL: URL(string: "coop.polypodtest.com://redirect")!)
        let auth = FeatureOIDAuth(service: service, config: config)
        auth.externalUserAgent = CustomUserAgent()
        return auth
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
