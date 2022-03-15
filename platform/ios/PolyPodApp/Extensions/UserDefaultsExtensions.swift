import Foundation

extension UserDefaults {
    enum Keys: String, CaseIterable {
        case resetUserDefaults
        case firstRun
        case skipSecurity
        case lastUpdateNotificationId
        case lastUpdateNotificationState
        case updateNotificationMockId
        case disableAuthCheck
        case authSetUp
    }
    
    func reset() {
        Keys.allCases.forEach { removeObject(forKey: $0.rawValue) }
    }
    
    func disableDataProtection() {
        guard let bundleIdentifier = Bundle.main.bundleIdentifier else { return }
        
        let fileURL = FileManager.default
            .urls(for: .libraryDirectory,
                     in: .userDomainMask)
            .first?
            .appendingPathComponent("Preferences")
            .appendingPathComponent("\(bundleIdentifier).plist")
        
        guard let fileURL = fileURL else { return }
        try? (fileURL as NSURL).setResourceValue(URLFileProtection.completeUntilFirstUserAuthentication,
                                                 forKey: .fileProtectionKey)
    }
}
