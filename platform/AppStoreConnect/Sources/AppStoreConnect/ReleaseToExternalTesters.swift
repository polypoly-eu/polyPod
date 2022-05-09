import AppStoreConnect_Swift_SDK
import Foundation

extension AppStoreConnect {
    /// Distribute the uploaded build to give beta groups.
    /// - Parameters:
    ///   - version: The version of the build to add groups to
    ///   - buildNumber: The build number for the given version to add groups to
    ///   - groups: The group ids to be added to the build
    ///   - appID: The target app id
    public func releaseBuildToExternalTesters(forApp appBundleIdentifier: String,
                                              withVersion version: String,
                                              buildNumber: Int,
                                              groups: [String]) async throws {
        let app = try await getApp(forBundleIdentifier: appBundleIdentifier)
        let build = try await buildIsProcessed(forAppID: app.id,
                                               withVersion: version,
                                               buildNumber: buildNumber)
        try await addAccess(forBetaGroups: groups, toBuild: build.id)
        try await create(betaBuildLocalizationForBuildWithId: build.id,
                         locale: "en",
                         whatsNew: "Build \(version)") // TODO: Create a proper change log
        try await submitAppForBetaReview(buildWithId: build.id)
    }
    
    func addAccess(forBetaGroups groups: [String], toBuild buildId: String) async throws {
        let addTesters = APIEndpoint.add(accessForBetaGroupsWithIds: groups,
                                         toBuildWithId: buildId)
        try await apiProvider.request(addTesters)
    }
}
