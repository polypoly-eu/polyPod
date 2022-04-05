import Foundation
import AppStoreConnect_Swift_SDK

extension AppStoreConnect {
    func getApp(forBundleIdentifier identifier: String) async throws -> App {
        let appEndpoint = APIEndpoint.apps(filters: [.bundleId([identifier])])
        let response = try await apiProvider.request(appEndpoint)
        if let app = response.data.first {
            return app
        }
        throw AppStoreConnectError.appNotFound
    }
}
