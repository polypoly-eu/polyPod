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
        _ = core_bootstrap(language_code)
    }
}
