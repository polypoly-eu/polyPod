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
       
        return handleCoreResponse(core_bootstrap(self.languageCode)) { responseObject in
            if responseObject["Ok"] != nil {
                return ()
            } else if let failure = try responseObject["Err"]?.getDictionary() {
                throw try mapError(failure)
            } else {
                throw MessagePackDecodingError.invalidCoreResult(info: "Received \(responseObject)")
            }
        }
    }
    
    /// Parse the FeatureManifest from the given json
    /// - Parameter json: Raw JSON to parse the FeatureManifest from
    /// - Returns: A FeatureManifest if parsing succeded, nil otherwise
    public func parseFeatureManifest(json: String) -> Result<FeatureManifest, Error> {
        handleCoreResponse(parse_feature_manifest_from_json(json)) { responseObject in
            if let manifestObject = try responseObject["Ok"]?.getDictionary() {
                return try mapFeatureManifest(manifestObject)
            } else if let failure = try responseObject["Err"]?.getDictionary() {
                throw try mapError(failure)
            } else {
                throw MessagePackDecodingError.invalidCoreResult(info: "Received \(responseObject)")
            }
        }
    }
    
    func handleCoreResponse<T>(_ byte_response: CByteBuffer, _ map: (CoreResponseObject) throws -> T) -> Result<T, Error> {
        Result {
            defer {
                free_bytes(byte_response.data)
            }
            return try map(getResponseObject(byte_response))
        }
    }
    
    func getResponseObject(_ cByteBuffer: CByteBuffer) throws -> [MessagePackValue: MessagePackValue] {
        let buffer = UnsafeBufferPointer(start: cByteBuffer.data, count: Int(cByteBuffer.length))
        let data = Data(buffer: buffer)
        
        let unpack = try MessagePack.unpackFirst(data)
        if let object = try unpack.getDictionary() {
            return object
        }
        
        throw CoreFailure.emptyResponse
    }
}
