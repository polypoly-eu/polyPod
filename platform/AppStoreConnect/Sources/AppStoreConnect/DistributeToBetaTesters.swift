import AppStoreConnect_Swift_SDK
import Foundation

extension AppStoreConnect {
    /// Distribute the uploaded build to give beta groups.
    /// - Parameters:
    ///   - version: The version of the build to add groups to
    ///   - buildNumber: The build number for the given version to add groups to
    ///   - groups: The group ids to be added to the build
    ///   - appID: The target app id
    public func distributeBetaBuild(withVersion version: String,
                                    buildNumber: Int,
                                    toBetaGroups groups: [String],
                                    forApp appBundleIdentifier: String) async throws {
        let app = try await getApp(forBundleIdentifier: appBundleIdentifier)
        let build = try await waitUntilBuildIsProcessed(forVersion: version,
                                                        buildNumber: buildNumber,
                                                        forApp: app.id)
        let addTesters = APIEndpoint.add(accessForBetaGroupsWithIds: groups,
                                         toBuildWithId: build.id)
        try await apiProvider.request(addTesters)
    }
}
