import PolyPodCore
import Foundation
import FlatBuffers

class Core {
    static let instance = Core()
    
    private let language_code: UnsafePointer<CChar>
    init() {
        self.language_code = NSString(string: Language.current).utf8String!
    }
    
    func bootstrap() {
        // TODO handle flatbuffer response
        let bytes = core_bootstrap(language_code)
        let byteBuffer = ByteBuffer(assumingMemoryBound: bytes.data, capacity: Int(bytes.length))
        let root = core_bootstrap_response_CoreBootstrapResponse.getRootAsCoreBootstrapResponse(bb: byteBuffer)
        if let failure = root.failure {
            print("Core Bootstrap failed \(failure.code) \(failure.message)")
        } else {
            print("Core Boostraped!!!")
        }
    }
}
