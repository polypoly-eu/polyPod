import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]

/// Swift wrapper around the Rust Core.
public final class Core {
    public static let instance = Core()
    
    // MARK: - Private config
    private var languageCode: UnsafePointer<CChar>!
    private var workDir: UnsafePointer<CChar>!
    
    private init() {}
    
    // MARK: - Public API
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    public func bootstrap(languageCode: String, workDir: String) -> Result<Void, Error> {
        // Force unwrap should be safe
        self.languageCode = NSString(string: languageCode).utf8String!
        self.workDir = NSString(string: workDir).utf8String!
       
        return handleCoreResponse(core_bootstrap(self.languageCode, self.workDir), { _ in })
    }
    
    public func isUserSessionExpired() -> Result<Bool, Error> {
        handleCoreResponse(is_session_expired()) { value in
            value.boolValue!
        }
    }
    
    public func appDidBecomeInactive() -> Result<Void, Error> {
        handleCoreResponse(app_did_become_inactive(), { _ in })
    }

    /// Loads the feature categories from the given features directory
    /// - Parameter featuresDirectory: Directory from which to load the feature categories.
     /// - Returns: A Result for loading operation.
    public func loadFeatureCategories(
        featuresDirectory: String
    ) -> Result<[FeatureCategory], Error> {
        let features_dir = NSString(string: featuresDirectory).utf8String!
        return handleCoreResponse(
            load_feature_categories(features_dir),
            mapFeatureCategories
        )
    }

    // MARK: - Internal API

    func handleCoreResponse<T>(
        _ byte_response: CByteBuffer,
        _ map: (MessagePackValue) throws -> T
    ) -> Result<T, Error> {
        Result {
            defer {
                free_bytes(byte_response.data)
            }
            
            let buffer = UnsafeBufferPointer(
                start: byte_response.data,
                count: Int(byte_response.length)
            )
            let data = Data(buffer: buffer)
            
            let responseObject: CoreResponseObject = try MessagePack.unpackFirst(data).getDictionary()
            
            if let responseObject = responseObject["Ok"] {
                return try map(responseObject)
            } else if let failure = try responseObject["Err"]?.getDictionary() {
                throw try mapError(failure)
            }
            
            throw DecodingError.invalidResponse(info: "\(String(describing: responseObject))")
        }
    }
}
