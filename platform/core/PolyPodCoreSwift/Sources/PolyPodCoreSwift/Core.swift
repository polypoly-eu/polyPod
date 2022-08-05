import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]

func unpackBytes(bytes: CByteBuffer) throws -> MessagePackValue {
    defer {
        free_bytes(bytes.data)
    }
    
    let buffer = UnsafeBufferPointer(
        start: bytes.data,
        count: Int(bytes.length)
    )
    let data = Data(buffer: buffer)
    
    return try MessagePack.unpackFirst(data)
}

func mapToPlatformRequest(request: MessagePackValue) throws -> PlatformRequest {
    guard let result = PlatformRequest.init(rawValue: request.stringValue ?? "") else {
        throw DecodingError.invalidValue(info: "Could not convert \(request.stringValue ?? "") to PlatformRequest. ")
    }
    return result
}

func handle(platformRequest: PlatformRequest) -> PlatformResponse {
    switch platformRequest {
    case .Example:
        return PlatformResponse.Example("Test")
    }
}

func packPlatformResponse(response: Result<PlatformResponse, Error>) -> Data {
    var result: [MessagePackValue: MessagePackValue] = [:]
    switch response {
    case .success(let platformResponse):
        switch platformResponse {
        case .Example(let name):
            result["Ok"] = .map(["Example": .string(name)])
        }
    case .failure(let error):
        result["Err"] = .string(error.localizedDescription)
    }
    
    return MessagePack.pack(.map(result))
}

extension Data {
    var toByteBuffer: CByteBuffer {
        let ptr = UnsafeMutablePointer<UInt8>.allocate(capacity: count)
        withUnsafeBytes { (buff) -> Void in
            ptr.initialize(from: buff.bindMemory(to: UInt8.self).baseAddress!, count: count)
        }
        return CByteBuffer(length: UInt32(count), data: ptr)
    }
}

enum PlatformRequest: String {
    case Example
}

enum PlatformResponse {
    case Example(String)
}

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
       
        return handleCoreResponse(core_bootstrap(self.languageCode, BridgeToPlatform(free_bytes: {
            $0?.deallocate()
        }, perform_request: { in_bytes in
            let response = Result<PlatformResponse, Error> {
                let request_from_core = try unpackBytes(bytes: in_bytes)
                let platformRequest = try mapToPlatformRequest(request: request_from_core)
                return handle(platformRequest: platformRequest)
            }
            
            // TODO: Use CoreFailure for failures.
            return packPlatformResponse(response: response).toByteBuffer
        })), { _ in })
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
