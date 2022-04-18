import Foundation
import AppStoreConnect_Swift_SDK

extension AppStoreConnect {
    
    /// Retrive the App Store Connect App for a given bundle identifier
    /// - Parameter identifier: Bundle identifier for the app to retrieve
    /// - Returns: App Store Connect App model
    func getApp(forBundleIdentifier identifier: String) async throws -> App {
        let appEndpoint = APIEndpoint.apps(filters: [.bundleId([identifier])])
        let response = try await apiProvider.request(appEndpoint)
        if let app = response.data.first {
            return app
        }
        throw AppStoreConnectError.appNotFound
    }
}
