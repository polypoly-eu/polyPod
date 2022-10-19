import Foundation
import PolyPodCoreSwift

extension UserDefaults {
    private enum MigratedKeys: String, CaseIterable {
        case lastUpdateNotificationId
        case lastUpdateNotificationState
    }
    
    func reset() {
        Keys.allCases.forEach { removeObject(forKey: $0.rawValue) }
    }
    
    // Currently we have project wide file protection enabled.
    // So, data protection is disabled for particular components.
    // Removing project wide data protection, and then enable when needed
    // is the best approach but it would be a bigger change.
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
    
    func migrateToCore() {
        MigratedKeys.allCases.forEach {
            let key = $0.rawValue
            if let value = string(forKey: key) {
                let result = Core.instance.executeRequest(
                    .setPreference(
                        args: SetPreferenceArguments(key: key, value: value)
                    )
                )
                switch result {
                case .success:
                    removeObject(forKey: key)
                    Log.info("Migrated user default \(key)")
                case .failure(let error):
                    Log.error("Failed to migrate user default '\(key)': \(error.localizedDescription)")
                }
            }
        }
    }
}
