import AppAuth
import Foundation

final class OIDAuth: NSObject {
    struct InvalidAuthResponseRepresentation: Error {}
    
    // MARK: - Properties

    /// State to be used to authorize requests.
    /// Use `state.performAction(freshTokens:)` to make any authorized requests,
    /// this will make sure that tokens are refreshed accordingly.
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

    // MARK: - Initializer
    
    /// Creates a  new instace.
    /// - Parameters:
    ///   - authorizationRequest: The authorization request that contains all of the necessary
    ///                           information to start the auth flow.
    ///                           All the required information - clientId, redirectURL...
    ///                           will be derived from this argument.
    ///   - oidExternalUserAgent: User agent meant to be used to start auth flow.
    init(authorizationRequest: OIDAuthorizationRequest, oidExternalUserAgent: OIDExternalUserAgent) {
        self.authorizationRequest = authorizationRequest
        self.oidExternalUserAgent = oidExternalUserAgent
    }
    
    /// Ends user session by clearing the auth state
    func clearAuthState() {
        self.state = nil
        _ = OIDTokenStorage
            .removeAuthState(forService: authorizationRequest.clientID)
            .inspectError { err in
                Log.error("Failed to remove auth state \(err)")
            }
        // TBD end session request
    }
    
    /// Loads the Auth state.
    /// - Parameter completion: The result of the load operation.
    ///                         After a successful load, the `state` peroperty will be initialized.
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
    
    /// Handles Auth redirect to complete the Auth flow.
    /// After redirect was handled, any subsequent calls to this function will be ignored,
    /// unless a new auth flow is started.
    /// - Parameter url: The auth redirect URL
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
    /// This is necessary to "trick" AppAuth that a full OAuth2.0 flow is happening form the client side.
    private final class OIDExternalUserAgentNoOp: NSObject, OIDExternalUserAgent {
        func present(_ request: OIDExternalUserAgentRequest, session: OIDExternalUserAgentSession) -> Bool {
            return true
        }
        
        func dismiss(animated: Bool, completion: @escaping () -> Void) {
            completion()
        }
    }
    
    /// Membership feature Auth configuration
    static func membershipFeatureAuth() -> OIDAuth {
        let redirectURL = URL(string: "coop.polypoly.polypod://membership_feature/oauth")!
        let serviceConfig = OIDServiceConfiguration(
            // No authorization endpoint, as auhorization it happens directly on backend side
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
