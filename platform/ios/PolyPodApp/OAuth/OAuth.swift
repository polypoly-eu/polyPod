import AppAuth
import Foundation

final class OIDAuth: NSObject {
    struct InvalidAuthResponseRepresentation: Error {}

    private(set) var state: OIDAuthState? {
        didSet {
            if let state = state {
                _ = OIDTokenStorage
                    .storeAuthState(state, forService: authorizationRequest.clientID)
                    .inspectError { err in
                        Log.error("Failed to store auth state \(err)")
                    }
                state.stateChangeDelegate = self
            }
        }
    }
    private var currentAuthFlow: OIDExternalUserAgentSession?
    private let oidExternalUserAgent: OIDExternalUserAgent
    private let authorizationRequest: OIDAuthorizationRequest

    init(authorizationRequest: OIDAuthorizationRequest, oidExternalUserAgent: OIDExternalUserAgent) {
        self.authorizationRequest = authorizationRequest
        self.oidExternalUserAgent = oidExternalUserAgent
    }

    func clearAuthState() {
        self.state = nil
        _ = OIDTokenStorage
            .removeAuthState(forService: authorizationRequest.clientID)
            .inspectError { err in
                Log.error("Failed to remove auth state \(err)")
            }
        // TBD end session request
    }

    func loadAuthState(completion: @escaping (Result<Void, Error>) -> Void) {
        if let state = try? OIDTokenStorage.getAuthState(forService: authorizationRequest.clientID).get() {
            self.state = state
            completion(.success(()))
            return
        }
        
        self.currentAuthFlow = OIDAuthState.authState(
            byPresenting: authorizationRequest,
            externalUserAgent: oidExternalUserAgent) { state, error in
            completion(Result {
                switch (state, error) {
                case let (state?, nil):
                    self.state = state
                case let (nil, error?):
                    throw error
                default:
                    throw InvalidAuthResponseRepresentation()
                }
            })
        }
    }

    func handleAuthRedirect(_ url: URL) {
        currentAuthFlow?.resumeExternalUserAgentFlow(with: url)
        currentAuthFlow = nil
    }
}

extension OIDAuth: OIDAuthStateChangeDelegate {
    // Handle state changes when token is refreshed or invalidated.
    func didChange(_ state: OIDAuthState) {
        self.state = state
    }
}

extension OIDAuth {
    /// An user agent which does not trigger any actual authorization flow.
    /// Meant to be used when the authorization flow happens on the backend side,
    /// while the app "just" needs to handle the code/token exchange.
    private final class OIDExternalUserAgentNoOp: NSObject, OIDExternalUserAgent {
        func present(_ request: OIDExternalUserAgentRequest, session: OIDExternalUserAgentSession) -> Bool {
            return true
        }
        
        func dismiss(animated: Bool, completion: @escaping () -> Void) {
            completion()
        }
    }
    
    /// Membership feature Atuh configuration
    static func membershipFeatureAuth() -> OIDAuth {
        let redirectURL = URL(string: "coop.polypoly.polypod://membership_feature/oauth")!
        let serviceConfig = OIDServiceConfiguration(
            // No authorization endpoint, as it happens directly on backend side
            authorizationEndpoint: URL(string: "")!,
            tokenEndpoint: URL(
                string: "https://keycloak.stage.polypoly.tech/realms/eu-members/protocol/openid-connect/token"
            )!
            // TBD endSessionEndpoint
        )
        let request = OIDAuthorizationRequest(configuration: serviceConfig,
                                              clientId: "pmf",
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
        return OIDAuth(authorizationRequest: request,
                       oidExternalUserAgent: OIDExternalUserAgentNoOp())
    }
}
