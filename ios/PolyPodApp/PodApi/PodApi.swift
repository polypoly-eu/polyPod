import Foundation

class PodApi {
    static let  shared = PodApi()
    
    lazy var polyIn: PolyIn  = {
        return PolyIn()
    }()
    
    lazy var polyOut: PolyOut  = {
        return PolyOut()
    }()
    
    lazy var polyNav: PolyNav  = {
        return PolyNav()	
    }()

}
