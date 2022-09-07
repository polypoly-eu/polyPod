public struct LoadFeatureArguments: Encodable {
    public init(featuresDir: String, forceShow: [FeatureCategoryId]) {
        self.featuresDir = featuresDir
        self.forceShow = forceShow
    }
    
    let featuresDir: String
    let forceShow: [FeatureCategoryId]
}

public enum CoreRequest: Encodable {
    case loadFeatureCategories(args: LoadFeatureArguments)
    case appDidBecomeInactive
    case isUserSessionExpired
    case setUserSessionTimeout(args: UserSessionTimeoutOption)
    case getUserSessionTimeoutOption
    case getUserSessionTimeoutOptionsConfig
    case executeRdfQuery(args: String)
    case executeRdfUpdate(args: String)
}
