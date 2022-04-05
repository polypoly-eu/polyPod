import Foundation

extension AppStoreConnect {
    
    /// Cleans up the private key by removing unecessary fields/characters
    /// - Parameter key: Base64 format key to be decoded
    /// - Returns: Decoded key suitable to be used with AppStoreConnect-Swift-SDK
    public static func cleanupPrivateKey(_ key: String) throws -> String {
        key
            .components(separatedBy: .newlines) // separate lines
            .dropFirst() // Remove -----BEGIN PRIVATE KEY-----
            .dropLast() // Remove -----END PRIVATE KEY-----
            .joined() // Join the rest of the lines
    }
}
