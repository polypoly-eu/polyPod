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
}
