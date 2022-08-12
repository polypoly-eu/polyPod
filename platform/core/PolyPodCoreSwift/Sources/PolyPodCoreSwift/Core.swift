import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]

enum PlatformRequest: String {
    case Example
}

enum PlatformResponse {
    case Example(String)
}

enum CoreRequest {
    case example(String, Optional<String>)
}

public enum CoreResponse {
    case example(Result<Optional<String>, CoreFailure>)
}

// Deserialize
// 1. Start by deserializing a result. If that is too hard, start with a string. 

/// Swift wrapper around the Rust Core.
public final class Core {
    public static let instance = Core()
    
    // MARK: - Private config
    private var languageCode: UnsafePointer<CChar>!
    private var fsRoot: UnsafePointer<CChar>!
    
    private init() {}
    
    // MARK: - Public API
    
    /*
     
     #[derive(Debug, Clone, Serialize, Deserialize)]
     pub enum CoreRequest {
         Example(String, Option<String>),
     }

     #[derive(Debug, Clone, Serialize, Deserialize)]
     pub enum CoreResponse {
         Example(Result<String, CoreFailure>),
     }
     
     */
    
    public func testPerformRequest() -> Result<CoreResponse, Error> {
        // create the enums
        // serialize a request
        // deserialize a response
        let request = CoreRequest.example("Hello1", nil)
        let result_bytes = perform_request(packCoreRequest(request: request).toByteBuffer)
        
        let res = handleCoreResponse(
            result_bytes,
            { responseValue -> CoreResponse in
                let coreResponse: CoreResponse = try deserialize(value: responseValue)
                return coreResponse
            }
        )
        
        return res
    }
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    public func bootstrap(languageCode: String, fsRoot: String) -> Result<Void, Error> {
        // Force unwrap should be safe
        self.languageCode = NSString(string: languageCode).utf8String!
        self.fsRoot = NSString(string: fsRoot).utf8String!

        let bridge = BridgeToPlatform(free_bytes: {
            $0?.deallocate()
        }, perform_request: { in_bytes in
            let response = Result<PlatformResponse, Error> {
                let request_from_core = try unpackBytes(bytes: in_bytes)
                let platformRequest = try mapToPlatformRequest(request: request_from_core)
                return handle(platformRequest: platformRequest)
            }
            
            // TODO: Use CoreFailure for failures.
            return packPlatformResponse(response: response).toByteBuffer
        })

        return handleCoreResponse(
            core_bootstrap(
                self.languageCode, 
                self.fsRoot, 
                bridge
            ), 
            { _ in }
        )
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
