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

    func logout() {
        self.state = nil
        _ = OIDTokenStorage
            .removeAuthState(forService: authorizationRequest.clientID)
            .inspectError { err in
                Log.error("Failed to remove auth state \(err)")
            }
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
    func didChange(_ state: OIDAuthState) {
        self.state = state
    }
}


extension OIDAuth {
    /// An user agent which does not trigger any actual authorization flow.
    /// Meant to be used when the first part of the usual OAuth2.0 flow happens on the backend side,
    /// and the Auth flow just needs to handle the code/token exchange.
    private final class OIDExternalUserAgentNoOp: NSObject, OIDExternalUserAgent {
        
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
    
    static func membershipFeatureAuth() -> OIDAuth {
        let serviceConfig = OIDServiceConfiguration(
            authorizationEndpoint: URL(string: "")!,
            tokenEndpoint: URL(string: "https://keycloak.stage.polypoly.tech/realms/eu-members/protocol/openid-connect/token")!
        )
        let request = OIDAuthorizationRequest(configuration: serviceConfig,
                                              clientId: "pmf",
                                              clientSecret: nil,
                                              scope: nil,
                                              redirectURL: nil,
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
