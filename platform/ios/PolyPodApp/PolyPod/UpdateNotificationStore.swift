import Foundation
import PolyPodCoreSwift

class UpdateNotificationStore: PolyPodCoreSwift.UpdateNotificationStore {
    private let idKey = UserDefaults.Keys.lastUpdateNotificationId.rawValue
    private let stateKey = UserDefaults.Keys
        .lastUpdateNotificationState.rawValue

    func read() -> (Int, String)? {
        let defaults = UserDefaults.standard
        if defaults.object(forKey: idKey) == nil {
            return nil
        }
        let id = defaults.integer(forKey: idKey)
        guard let state = UserDefaults.standard.string(forKey: stateKey) else {
            return nil
        }
        return (id, state)
    }

    func write(id: Int, state: String) {
        let defaults = UserDefaults.standard
        defaults.set(id, forKey: idKey)
        defaults.set(state, forKey: stateKey)
    }
}
