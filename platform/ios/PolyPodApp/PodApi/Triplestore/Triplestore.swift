import Foundation
import MessagePack
import PolyPodCoreSwift

protocol TriplestoreProtocol: AnyObject {
    func query(
        query: String,
        completionHandler: @escaping (MessagePackValue, Error?) -> Void
    )
    func update(
        query: String,
        completionHandler: @escaping (Error?) -> Void
    )
}

final class Triplestore: TriplestoreProtocol {
    
    func query(
        query: String,
        completionHandler: @escaping (MessagePackValue, Error?) -> Void
    ) {
        switch Core.instance
            .executeRdfQuery(query) {
        case .success(let result):
            completionHandler(result, nil)
        case .failure(let error):
            completionHandler(nil, error)
        }
    }
    
    func update(
        query: String,
        completionHandler: @escaping (Error?) -> Void
    ) {
        switch Core.instance
            .executeRdfUpdate(query) {
        case .success:
            completionHandler(nil)
        case .failure(let error):
            completionHandler(error)
        }
    }
}
