import PolyPodCore
import Foundation
import FlatBuffers

final class Core {
    static let instance = Core()
    
    private let language_code: UnsafePointer<CChar>
    init() {
        self.language_code = NSString(string: Language.current).utf8String!
    }
    
    func bootstrap() {
        let responseByteBuffer = core_bootstrap(language_code)
        defer {
            free_bytes(responseByteBuffer.data)
        }
        let byteBuffer = ByteBuffer(assumingMemoryBound: responseByteBuffer.data, capacity: Int(responseByteBuffer.length))
        let root = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(bb: byteBuffer)
        if let failure = root.failure {
            // TODO: What to do if core_bootstrap failed.
            Log.info("Failed to bootsrap core \(failure.code) \(String(describing: failure.message))")
        } else {
            Log.info("Core Boostraped!!!")
        }
        
    }
    
    func parseFeatureManifest(json: String) -> FeatureManifest? {
        let responseByteBuffer = parse_feature_manifest_from_json(json)
        defer {
            free_bytes(responseByteBuffer.data)
        }
        let byteBuffer = ByteBuffer(assumingMemoryBound: responseByteBuffer.data, capacity: Int(responseByteBuffer.length))
        let response = FeatureManifestParsingResponse.getRootAsFeatureManifestParsingResponse(bb: byteBuffer)
        switch response.resultType {
        case .none_:
            break
        case .featuremanifest:
            return response.result(type: FeatureManifest.self)
        case .failure:
            if let failure = response.result(type: Failure.self) {
                Log.error("Failed to load Feature Manifest \(failure.code) \(String(describing: failure.message))")
            }
        }
        return nil
    }
}
