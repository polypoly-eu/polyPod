import LocalAuthentication

private func isSimulator() -> Bool {
    #if targetEnvironment(simulator)
    return true
    #else
    return false
    #endif
}

class Authentication {
    static let shared = Authentication()
    
    private static let disableCheckKey = UserDefaults.Keys.disableAuthCheck
        .rawValue
    private static let setUpKey = UserDefaults.Keys.authSetUp.rawValue
    
    private var authenticated = false
    
    private init() {}
    
    func shouldShowPrompt() -> Bool {
        return !isCheckDisabled() && !isSetUp()
    }
    
    func disableCheck() {
        UserDefaults.standard.set(true, forKey: Authentication.disableCheckKey)
    }
    
    func setUp(_ completeAction: @escaping () -> Void) {
        authenticateLocally(reason: "auth_prompt_set_up") {
            self.authenticated = true
            UserDefaults.standard.set(true, forKey: Authentication.setUpKey)
            completeAction()
        }
    }
    
    func authenticate(_ successAction: @escaping () -> Void) {
        if isCheckDisabled() || !isSetUp() || authenticated {
            successAction()
            return
        }
        
        authenticateLocally(reason: "auth_prompt_unlock") {
            self.authenticated = true
            successAction()
        }
    }
    
    private func isCheckDisabled() -> Bool {
        return isSimulator() || UserDefaults.standard.bool(
            forKey: Authentication.disableCheckKey
        )
    }
    
    private func isSetUp() -> Bool {
        return UserDefaults.standard.bool(forKey: Authentication.setUpKey)
    }
    
    private func authenticateLocally(
        reason: String,
        _ successAction: @escaping () -> Void
    ) {
        let context = LAContext()
        context.evaluatePolicy(
            LAPolicy.deviceOwnerAuthentication,
            localizedReason: NSLocalizedString(reason, comment: "")
        ) { (success, error) in
            if !success {
                print("Authentication failed: \(String(describing: error))")
                return
            }
            successAction()
        }
    }
    
    func clear() {
        authenticated = false
    }
}
