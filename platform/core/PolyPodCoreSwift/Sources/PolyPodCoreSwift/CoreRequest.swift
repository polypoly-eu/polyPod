public struct LoadFeatureArguments: Encodable {
    public init(featuresDir: String, forceShow: [FeatureCategoryId]) {
        self.featuresDir = featuresDir
        self.forceShow = forceShow
    }
    
    let featuresDir: String
    let forceShow: [FeatureCategoryId]
}

public struct SetPreferenceArguments: Encodable {
    let key: String
    let value: String
    
    public init(key: String, value: String) {
        self.key = key
        self.value = value
    }
}

public enum CoreRequest: Encodable {
    case loadFeatureCategories(args: LoadFeatureArguments)
    case handleAppDidBecomeInactive
    case isUserSessionExpired
    case setUserSessionTimeout(args: UserSessionTimeoutOption)
    case getUserSessionTimeoutOption
    case getUserSessionTimeoutOptionsConfig
    case executeRdfQuery(args: String)
    case executeRdfUpdate(args: String)
    case handleStartup
    case handleFirstRun
    case handleInAppNotificationSeen
    case handlePushNotificationSeen
    case getShowInAppNotification
    case getShowPushNotification
    case clearPreferences
    case setPreference(args: SetPreferenceArguments)
}
