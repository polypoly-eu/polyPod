import XCTest
@testable import PolyPodCoreSwift
import MessagePack

enum FailureCode: Int, Decodable {
    case CoreNotBootstrapped = 1
    case CoreAlreadyBootstrapped
}

struct CoreFailure: Decodable {
    let code: Int
    let messsage: String
}
struct BootstrapResponse: Decodable {
    let failure: CoreFailure?
}

final class PolyPodCoreSwiftTests: XCTestCase {
    
    func test_some(){
        // TODO: Test the interaction with Core
        let bytes = Core.instance.bootstrap(languageCode: "some")
    }
    
    
}
