import AppAuth
import Foundation

let clientId = "pmf"
let redirectURL = URL(string: "coop.polypoly.polypod://oauth/redirect")!

final class OAuth {
    static let instance = OAuth()
    var currentFlow: OIDExternalUserAgentSession?
    var externalUserAgent: OIDExternalUserAgent?
    
    private init() {}
    
    func handleDeeplinkURL(_ url: URL) -> Bool {
        guard let flow = currentFlow else {
            return false
        }
        return flow.resumeExternalUserAgentFlow(with: url)
    }

    func startAuth(clientId: String = clientId,
                   redirectURL: URL = redirectURL,
                   _ completion: @escaping (Result<OIDAuthState, Error>) -> Void) {
        currentFlow = OIDAuthState.authState(byPresenting: .default(clientId: clientId, redirectURL: redirectURL),
                                             externalUserAgent: externalUserAgent!,
                                             callback: { state, error in
            switch (state, error) {
            case let (state?, nil):
                completion(.success(state))
            case let (nil, error?):
                completion(.failure(error))
            default:
                fatalError("Invalid response")
            }
        })
    }
}

extension OIDAuthorizationRequest {
    static let authEndpoint = URL(string: "https://keycloak.stage.polypoly.tech/realms/eu-members/protocol/openid-connect/auth")!
    static let tokenEndpoint = URL(string: "https://keycloak.stage.polypoly.tech/realms/eu-members/protocol/openid-connect/token")!
    
    static func `default`(clientId: String, redirectURL: URL) -> OIDAuthorizationRequest {
        let config = OIDServiceConfiguration(authorizationEndpoint: authEndpoint,
                                             tokenEndpoint: tokenEndpoint)
        
        let verifier = OIDAuthorizationRequest.generateCodeVerifier()
        let challenge = OIDAuthorizationRequest.codeChallengeS256(forVerifier: verifier)
        return OIDAuthorizationRequest(configuration: config,
                                       clientId: clientId,
                                       clientSecret: nil,
                                       scope: OIDScopeUtilities.scopes(with: [OIDScopeEmail, OIDScopeOpenID]),
                                       redirectURL: redirectURL,
                                       responseType: OIDResponseTypeCode,
                                       state: nil,
                                       nonce: nil,
                                       codeVerifier: verifier,
                                       codeChallenge: challenge,
                                       codeChallengeMethod: OIDOAuthorizationRequestCodeChallengeMethodS256,
                                       additionalParameters: nil)
    }
}
