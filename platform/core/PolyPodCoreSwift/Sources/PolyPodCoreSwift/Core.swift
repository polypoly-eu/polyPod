import PolyPodCore
import Foundation
import FlatBuffers

/// Possible errors that can be thrown by PolyPodCoreSwift
public enum PolyPodCoreError: Error {
    /// Internal Rust Core failure with error code and message
    case internalCoreFailure(context: String, failure: FlatbObject<Failure>)
    /// Rust Core returned an invalid result type for a given operation
    case invalidResult(context: String, result:String)
    /// Rust Core returned an invalid failure content
    case invalidFailure(context: String)
    
    var localizedDescription: String {
        switch self {
        case let .internalCoreFailure(context, failure):
            return "\(context) -> internal Core Failure: \(failure.code) \(String(describing: failure.message))"
        case let .invalidResult(context, result):
            return "\(context) -> received invalid result type \(result)"
        case let .invalidFailure(context):
            return "\(context) -> recevied failure result type without failure content"
        }
    }
}

/// Swift wrapper around the Rust Core. Encapsulates specific Pointer and Flabuffer operations.
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
        return Result {
            let responseBytes = core_bootstrap(languageCode)
            let byteBuffer = ByteBuffer(cByteBuffer: responseBytes)
            let response = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(bb: byteBuffer)
            if let failure = response.failure {
                throw PolyPodCoreError.internalCoreFailure(context: "Failed to bootstrap core",
                                                           failure: FlatbObject(responseBytes.data, failure))
            }
        }
    }
    
    /// Parse the FeatureManifest from the given json
    /// - Parameter json: Raw JSON to parse the FeatureManifest from
    /// - Returns: A FeatureManifest if parsing succeded, nil otherwise
    public func parseFeatureManifest(json: String) -> Result<FlatbObject<FeatureManifest>, Error> {
        Result {
            let responseBytes = parse_feature_manifest_from_json(json)
            let byteBuffer = ByteBuffer(cByteBuffer: responseBytes)
            let response = FeatureManifestParsingResponse.getRootAsFeatureManifestParsingResponse(bb: byteBuffer)
            switch response.resultType {
            case .featuremanifest:
                return FlatbObject(responseBytes.data, response.result(type: FeatureManifest.self))
            case .failure:
                if let failure = response.result(type: Failure.self) {
                    throw PolyPodCoreError.internalCoreFailure(
                        context: "Failed to load Feature Manifest",
                        failure: FlatbObject(responseBytes.data, failure)
                    )
                } else {
                    throw PolyPodCoreError.invalidFailure(context: "Failed to load Feature Manifest")
                }
            default:
                throw PolyPodCoreError.invalidResult(
                    context: "Failed to load Feature Manifest",
                    result: "\(response.resultType)"
                )
            }
        }
    }
}

extension ByteBuffer {
    init(cByteBuffer: CByteBuffer) {
        self.init(assumingMemoryBound: cByteBuffer.data, capacity: Int(cByteBuffer.length))
    }
}
