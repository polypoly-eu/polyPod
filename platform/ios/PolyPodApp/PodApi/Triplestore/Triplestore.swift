import Foundation
import MessagePack
import PolyPodCoreSwift

protocol Triplestore {
    func query(
        query: String,
        completionHandler: @escaping (MessagePackValue, Error?) -> Void
    )
    func update(
        query: String,
        completionHandler: @escaping (Error?) -> Void
    )
}

extension Core: Triplestore {
    func query(
        query: String,
        completionHandler: @escaping (MessagePackValue, Error?) -> Void
    ) {
        switch executeRdfQuery(query) {
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
        switch executeRdfUpdate(query) {
        case .success:
            completionHandler(nil)
        case .failure(let error):
            completionHandler(error)
        }
    }
}
