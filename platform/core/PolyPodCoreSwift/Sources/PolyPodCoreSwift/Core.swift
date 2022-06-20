import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]

/// Swift wrapper around the Rust Core.
public final class Core {
    public static let instance = Core()
    
    // MARK: - Private config
    private var languageCode: UnsafePointer<CChar>!
    
    private init() {}
    
    // MARK: - Public API
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    public func bootstrap(languageCode: String) -> Result<Void, Error> {
        // Force unwrap should be safe
        self.languageCode = NSString(string: languageCode).utf8String!
       
        return handleCoreResponse(core_bootstrap(self.languageCode), { _ in })
    }
    
    /// Parse the FeatureManifest from the given json
    /// - Parameter json: Raw JSON to parse the FeatureManifest from
    /// - Returns: A FeatureManifest if parsing succeded, nil otherwise
    public func parseFeatureManifest(json: String) -> Result<FeatureManifest, Error> {
        handleCoreResponse(parse_feature_manifest_from_json(json), mapFeatureManifest)
    }
    
    func handleCoreResponse<T>(_ byte_response: CByteBuffer, _ map: (MessagePackValue) throws -> T) -> Result<T, Error> {
        Result {
            defer {
                free_bytes(byte_response.data)
            }
            
            let buffer = UnsafeBufferPointer(start: byte_response.data, count: Int(byte_response.length))
            let data = Data(buffer: buffer)
            
            let responseObject = try MessagePack.unpackFirst(data).getDictionary()
            
            if let responseObject = responseObject?["Ok"] {
                return try map(responseObject)
            } else if let failure = try responseObject?["Err"]?.getDictionary() {
                throw try mapError(failure)
            }
            
            throw DecodingError.invalidResponse(info: "\(String(describing: responseObject))")
        }
    }
}
