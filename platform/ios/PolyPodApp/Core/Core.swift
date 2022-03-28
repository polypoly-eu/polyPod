import PolyPodCore
import Foundation
import FlatBuffers

final class Core {
    static let instance = Core()
    
    // MARK: - Private config
    private let language_code: UnsafePointer<CChar>
    
    private init() {
        // Force unwrap should be safe
        self.language_code = NSString(string: Language.current).utf8String!
    }
    
    // MARK: - Internal API
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    func bootstrap() {
        processCoreResponse(core_bootstrap(language_code)) { byteBuffer in
            let result = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(bb: byteBuffer)
            if let failure = result.failure {
                let errorInfo = "Failed to bootstrap core \(failure.code) \(String(describing: failure.message))"
                assertionFailure(errorInfo)
                Log.error(errorInfo)
            } else {
                Log.info("Core Bootstraped!!!")
            }
        }
    }
    
    /// Parse the FeatureManifest from the given json
    /// - Parameter json: Raw JSON to parse the FeatureManifest from
    /// - Returns: A FeatureManifest if parsing succeded, nil otherwise
    func parseFeatureManifest(json: String) -> FeatureManifest? {
        processCoreResponse(parse_feature_manifest_from_json(json)) { byteBuffer in
            let response = FeatureManifestParsingResponse.getRootAsFeatureManifestParsingResponse(bb: byteBuffer)
            switch response.resultType {
            case .featuremanifest:
                return response.result(type: FeatureManifest.self)
            case .failure:
                if let failure = response.result(type: Failure.self) {
                    Log.error("Failed to load Feature Manifest: \(failure.code) \(String(describing: failure.message))")
                } else {
                    Log.error("Failed to load Feature Manifest: recevied failure result type without failure content")
                }
            default:
                Log.error("Failed to load Feature Manifest, received invalid result type: \(response.resultType)")
            }
            return nil
        }
    }
    
    // MARK: - Private utils
    
    private func processCoreResponse<T>(_ responseByteBuffer: CByteBuffer, flatbufferMapping: (ByteBuffer) -> T) -> T {
        defer {
            free_bytes(responseByteBuffer.data)
        }
        return flatbufferMapping(
            ByteBuffer(assumingMemoryBound: responseByteBuffer.data, capacity: Int(responseByteBuffer.length))
        )
    }
}
