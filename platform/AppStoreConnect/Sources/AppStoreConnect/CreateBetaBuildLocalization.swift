import Foundation
import AppStoreConnect_Swift_SDK

extension AppStoreConnect {
    func create(
        betaBuildLocalizationForBuildWithId id: String,
        locale: String,
        whatsNew: String? = nil) async throws {
            let endpoint = APIEndpoint.create(betaBuildLocalizationForBuildWithId: id,
                                              locale: locale,
                                              whatsNew: whatsNew)
            _ = try await apiProvider.request(endpoint)
    }
}
