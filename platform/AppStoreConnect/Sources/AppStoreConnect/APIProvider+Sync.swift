import Foundation
import AppStoreConnect_Swift_SDK

/// Synchronous variants for AppStoreConnect-Swift-SDK API.
extension APIProvider {
    func request<T: Decodable>(_ endpoint: APIEndpoint<T>) throws -> T {
        let semaphore = DispatchSemaphore(value: 0)
        var capturedResult: Result<T, Swift.Error>!
        request(endpoint) { result in
            capturedResult = result
            semaphore.signal()
        }
        semaphore.wait()
        return try capturedResult.get()
    }
    
    func request(_ endpoint: APIEndpoint<Void>) throws {
        let semaphore = DispatchSemaphore(value: 0)
        var capturedResult: Result<Void, Swift.Error>!
        request(endpoint) { result in
            capturedResult = result
            semaphore.signal()
        }
        semaphore.wait()
        return try capturedResult.get()
    }
}
