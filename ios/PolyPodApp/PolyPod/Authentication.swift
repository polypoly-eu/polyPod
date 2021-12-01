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
        let firstRun = FirstRun.read()
        return !(firstRun || isCheckDisabled() || isSetUp()) && isAvailable()
    }
    
    private func isAvailable() -> Bool {
        return !isSimulator() && LAContext().canEvaluatePolicy(
            .deviceOwnerAuthentication,
            error: nil
        )
    }
    
    func disableCheck() {
        UserDefaults.standard.set(true, forKey: Authentication.disableCheckKey)
    }
    
    func setUp(_ completeAction: @escaping (Bool) -> Void) {
        authenticateLocally(reason: "auth_prompt_set_up") { success in
            self.authenticated = success
            UserDefaults.standard.set(true, forKey: Authentication.setUpKey)
            completeAction(success)
        }
    }
    
    func authenticate(_ completeAction: @escaping (Bool) -> Void) {
        if isCheckDisabled() || !isSetUp() || authenticated {
            completeAction(true)
            return
        }
        
        authenticateLocally(reason: "auth_prompt_unlock") { success in
            self.authenticated = success
            completeAction(success)
        }
    }
    
    private func isCheckDisabled() -> Bool {
        return UserDefaults.standard.bool(
            forKey: Authentication.disableCheckKey
        )
    }
    
    private func isSetUp() -> Bool {
        return UserDefaults.standard.bool(forKey: Authentication.setUpKey)
    }
    
    private func authenticateLocally(
        reason: String,
        _ completeAction: @escaping (Bool) -> Void
    ) {
        let context = LAContext()
        context.evaluatePolicy(
            LAPolicy.deviceOwnerAuthentication,
            localizedReason: NSLocalizedString(reason, comment: "")
        ) { (success, error) in
            if !success {
                Log.error("Authentication failed: \(String(describing: error))")
            }
            completeAction(success)
        }
    }
    
    func clear() {
        authenticated = false
    }
}
