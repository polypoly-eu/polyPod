// Please remove this line and the empty one after it


import Foundation
import PolyPodCore

extension UserDefaults {
    static var keyValueStore: KeyValueStore {
        KeyValueStore(
            context: nil,
            read_int: { _, key in
                guard let key = key.map(String.init(cString:)),
                      UserDefaults.standard.object(forKey: key) != nil else {
                          return .none()
                      }
                let value = UInt(UserDefaults.standard.integer(forKey: key))
                return .some(value)
            },
            write_int: { _, key, value in
                guard let key = key.map(String.init(cString:)) else { return }
                UserDefaults.standard.set(value, forKey: key)
            }
        )
    }
}
