import Foundation

extension UserDefaults {
    enum Keys: String, CaseIterable {
        case resetUserDefaults
        case firstRun
        case skipSecurity
        case updateNotificationMockId
        case disableAuthCheck
        case authSetUp
        case didConfigureAuth
        case showDeveloperFeaturesId
    }
}
