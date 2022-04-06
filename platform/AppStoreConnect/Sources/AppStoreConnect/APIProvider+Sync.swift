import Foundation
import AppStoreConnect_Swift_SDK

/// Synchronous variants for AppStoreConnect-Swift-SDK API.
extension APIProvider {
    func request<T: Decodable>(_ endpoint: APIEndpoint<T>) async throws -> T {
        try await withCheckedThrowingContinuation { continuation in
            request(endpoint, completion: continuation.resume(with:))
        }
    }
    
    func request(_ endpoint: APIEndpoint<Void>) async throws {
        try await withCheckedThrowingContinuation { continuation in
            request(endpoint, completion: continuation.resume(with:))
        }
    }
}
