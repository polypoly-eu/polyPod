import Foundation

enum KeyDecodingError: Error {
    case invalidBase64Key
}

extension AppStoreConnect {
    
    /// Decodes the given base64 key to AppStoreConnect-Swift-SDK suitable key format.
    /// - Parameter key: Base64 format key to be decoded
    /// - Returns: Decoded key suitable to be used with AppStoreConnect-Swift-SDK
    public static func decodeBase64Key(_ key: String) throws -> String {
        guard let data = Data(base64Encoded: key),
              let decodedKey = String(data: data, encoding: .utf8) else {
                  throw KeyDecodingError.invalidBase64Key
              }
        
        return decodedKey
            .components(separatedBy: .newlines) // separate lines
            .dropFirst() // Remove -----BEGIN PRIVATE KEY-----
            .dropLast() // Remove -----END PRIVATE KEY-----
            .joined() // Join the rest of the lines
    }
}
