import PolyPodCore
import Foundation
import FlatBuffers

/// Possible errors that can be thrown by PolyPodCoreSwift
public enum PolyPodCoreError: Error {
    /// Internal Rust Core failure with error code and message
    case internalCoreFailure(Failure)
    /// Rust Core returned an invalid result type for a given operation
    case invalidResult(String)
    /// Rust Core returned an invalid failure content
    case invalidFailure(String)
    
    var localizedDescription: String {
        switch self {
        case let .internalCoreFailure(content):
            return "Internal Core Failure: \(content.code) \(String(describing: content.message))"
        case let .invalidResult(content):
            return "Core Failure: \(content)"
        case let .invalidFailure(content):
            return "Core Failure: \(content)"
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
        
        return processCoreResponse(core_bootstrap(languageCode)) { byteBuffer in
            let response = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(bb: byteBuffer)
            if let failure = response.failure {
                throw PolyPodCoreError.internalCoreFailure(failure)
            }
        }
    }
    
    /// Parse the FeatureManifest from the given json
    /// - Parameter json: Raw JSON to parse the FeatureManifest from
    /// - Returns: A FeatureManifest if parsing succeded, nil otherwise
    public func parseFeatureManifest(json: String) -> Result<FeatureManifest, Error> {
        processCoreResponse(parse_feature_manifest_from_json(json)) { byteBuffer in
            let response = FeatureManifestParsingResponse.getRootAsFeatureManifestParsingResponse(bb: byteBuffer)
            switch response.resultType {
            case .featuremanifest:
                return response.result(type: FeatureManifest.self)
            case .failure:
                if let failure = response.result(type: Failure.self) {
                    throw PolyPodCoreError.internalCoreFailure(failure)
                } else {
                    throw PolyPodCoreError.invalidFailure("Failed to load Feature Manifest: recevied failure result type without failure content")
                }
            default:
                throw PolyPodCoreError.invalidResult("Failed to load Feature Manifest, received invalid result type: \(response.resultType)")
            }
        }
    }
    
    // MARK: - Private utils
    
    private func processCoreResponse<T>(_ responseByteBuffer: CByteBuffer,
                                        flatbufferMapping: (ByteBuffer) throws -> T) -> Result<T, Error> {
        defer {
            free_bytes(responseByteBuffer.data)
        }
        return Result {
            try flatbufferMapping(
                ByteBuffer(assumingMemoryBound: responseByteBuffer.data, capacity: Int(responseByteBuffer.length))
            )
        }
    }
}
