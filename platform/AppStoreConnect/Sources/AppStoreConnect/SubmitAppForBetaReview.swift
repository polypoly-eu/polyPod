import Foundation
import AppStoreConnect_Swift_SDK

extension AppStoreConnect {
    func submitAppForBetaReview(buildWithId id: String) async throws {
        NSLog("Submiting build \(id) to beta review.")
        let endpoint = APIEndpoint.submitAppForBetaReview(buildWithId: id)
        let response = try await apiProvider.request(endpoint)
        guard let state = response.data.attributes?.betaReviewState else {
            NSLog("Failed to extract response for beta app review submission.")
            throw AppStoreConnectError.betaAppReviewStateIsMissing
        }
        
        if state == .rejected {
            NSLog("Beta app review submission was rejected.")
            throw AppStoreConnectError.betaAppReviewRejected
        }
        NSLog("Beta app review submission was succesful.")
    }
}
