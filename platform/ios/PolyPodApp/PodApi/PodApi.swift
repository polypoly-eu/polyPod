import Foundation

class PodApi {
    static let shared = PodApi()
    
    lazy var polyIn: PolyIn  = {
        return CoreDataStack.shared
    }()
    
    lazy var polyOut: PolyOut  = {
        return PolyOut()
    }()
    
    lazy var polyNav: PolyNav  = {
        return PolyNav()
    }()
    
    lazy var info: Info = {
        return Info()
    }()
    
    lazy var network: Network = {
        return Network()
    }()
}
