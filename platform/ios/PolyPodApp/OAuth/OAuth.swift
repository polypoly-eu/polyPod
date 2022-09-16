import AppAuth
import Foundation

protocol FeatureOIDAuthStateStorage {
    func saveState(_ state: OIDAuthState, service: String)
    func readState(service: String) -> Result<OIDAuthState?, Error>
    func clearState(service: String) -> Result<Void, Error>
}

struct OIDAuthConfig {
    let authEndpoint: URL
    let tokenEndpoint: URL
    let clientId: String
    let redirectURL: URL
}
extension OIDAuthConfig {
    static var membership: OIDAuthConfig {
        OIDAuthConfig(
            authEndpoint: URL(string: "https://keycloak.stage.polypoly.tech/realms/eu-members/protocol/openid-connect/auth")!,
            tokenEndpoint: URL(string: "https://keycloak.stage.polypoly.tech/realms/eu-members/protocol/openid-connect/token")!,
            clientId: "pmf",
            redirectURL: URL(string: "coop.polypoly.polypod://oauth/redirect")!)
    }
}

final class FeatureOIDAuth {
    let config: OIDAuthConfig
    var externalUserAgent: OIDExternalUserAgent?
    private var state: OIDAuthState?
    private let service: String
    private var currentAuthFlow: OIDExternalUserAgentSession?
    var urlSession: URLSession = .shared
    
    init(service: String, config: OIDAuthConfig) {
        self.service = service
        self.config = config
        self.state = try? FeatureTokenStorage.getAuthState(forService: service).get()
        OIDURLSessionProvider.setSession(urlSession)
    }
    
    func clearAuthState() {
        self.state = nil
        FeatureTokenStorage.removeAuthState(forService: service)
    }
    
    func getAuthState(completion: @escaping (Result<OIDAuthState, Error>) -> Void) {
        if let state = self.state {
            return completion(.success(state))
        }
        
        if let state = try? FeatureTokenStorage.getAuthState(forService: service).get() {
            self.state = state
            return completion(.success(state))
        }
        currentAuthFlow = OIDAuthState.authState(byPresenting: makeAuthorizationRequest(),
                                                 externalUserAgent: externalUserAgent!,
                                                 callback: { state, error in
            switch (state, error) {
            case let (state?, nil):
                self.state = state
                FeatureTokenStorage.storeAuthState(state, forService: self.service)
                completion(.success(state))
            case let (nil, error?):
                completion(.failure(error))
            default:
                fatalError("Invalid response")
            }
        })
    }
    
    func handleAuthRedirect(_ url: URL) {
        currentAuthFlow?.resumeExternalUserAgentFlow(with: url)
    }
    
    private func makeAuthorizationRequest() -> OIDAuthorizationRequest {
        let oidConfig = OIDServiceConfiguration(authorizationEndpoint: config.authEndpoint,
                                             tokenEndpoint: config.tokenEndpoint)
        
        let verifier = OIDAuthorizationRequest.generateCodeVerifier()
        let challenge = OIDAuthorizationRequest.codeChallengeS256(forVerifier: verifier)
        let scope = OIDScopeUtilities.scopes(with: [OIDScopeEmail, OIDScopeOpenID])
        return OIDAuthorizationRequest(configuration: oidConfig,
                                       clientId: config.clientId,
                                       clientSecret: nil,
                                       scope: scope,
                                       redirectURL: config.redirectURL,
                                       responseType: OIDResponseTypeCode,
                                       state: nil,
                                       nonce: nil,
                                       codeVerifier: verifier,
                                       codeChallenge: challenge,
                                       codeChallengeMethod: OIDOAuthorizationRequestCodeChallengeMethodS256,
                                       additionalParameters: nil)
    }
}
