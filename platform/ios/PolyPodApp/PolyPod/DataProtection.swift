import Combine
import UIKit

final class DataProtection {
    static let instance = DataProtection()
    
    typealias ProtectedDataAvailability = Bool
    var state: AnyPublisher<ProtectedDataAvailability, Never> {
        _state.eraseToAnyPublisher()
    }
    
    private let _state: CurrentValueSubject<ProtectedDataAvailability, Never>
    
    private init() {
        _state = .init(UIApplication.shared.isProtectedDataAvailable)
    }
    
    func protectedDataDidBecomeAvailable() {
        _state.send(true)
    }
    
    func protectedDataWillBecomeUnavailable() {
        _state.send(false)
    }
}
