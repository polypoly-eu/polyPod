import UIKit
import PolyPodCore

private class LastUpdateNotification {
    private static let idKey = UserDefaults.Keys
        .lastUpdateNotificationId.rawValue
    private static let stateKey = UserDefaults.Keys
        .lastUpdateNotificationState.rawValue

    static func readId() -> Int? {
        UserDefaults.standard.integer(forKey: idKey)
    }
    
    static func readLastState() -> Int? {
        UserDefaults.standard.integer(forKey: stateKey)
    }
    
    static func write(id: Int, state: Int) {
        let defaults = UserDefaults.standard
        defaults.set(id, forKey: idKey)
        defaults.set(state, forKey: stateKey)
    }
}

private class UpdateNotificationMockId {
    private static let key = UserDefaults.Keys.updateNotificationMockId.rawValue
    
    static func read() -> Int? {
        let defaults = UserDefaults.standard
        if defaults.object(forKey: key) == nil {
            return nil
        }
        return defaults.integer(forKey: key)
    }
}

class UpdateNotification {
    
    private struct Data {
        private static let invalid = Data(
            id: 0,
            pushDelay: 0,
            title: [String: String](),
            text: [String: String]()
        )
        
        static func load() -> Data {
            guard let asset = NSDataAsset(
                name: "UpdateNotification",
                bundle: Bundle.main
            ) else {
                return invalid
            }
            
            guard let json = try? JSONSerialization.jsonObject(
                with: asset.data
            ) as? [String: Any] else {
                return invalid
            }
            
            guard let id = json["id"] as? Int,
                  let pushDelay = json["pushDelay"] as? Int,
                  let title = json["title"] as? [String: String],
                  let text = json["text"] as? [String: String]
            else {
                return invalid
            }
            return Data(id: id, pushDelay: pushDelay, title: title, text: text)
        }
        
        private static func readLocalizedValue(
            _ values: [String: String]
        ) -> String {
            return values[Language.current] ?? values[Language.fallback]!
        }
        
        let id: Int
        let pushDelay: Int
        let title: [String: String]
        let text: [String: String]
        
        var localizedTitle: String {
            return Data.readLocalizedValue(self.title)
        }
        
        var localizedText: String {
            return Data.readLocalizedValue(self.text)
        }
    }
    
    private static let notificationData = Data.load()
    
    let pushDelay = notificationData.pushDelay
    let title = notificationData.localizedTitle
    let text = notificationData.localizedText
    
    private let raw: OpaquePointer

    init() {
        let storage = UpdateNotificationStorage(
            context: nil,
            read_id: { _ in
                UInt32(UpdateNotificationMockId.read() ?? UpdateNotification.notificationData.id)
            },
            read_last_id: { _ in
                if let id = LastUpdateNotification.readId() {
                    return Option32(tag: .init(rawValue: 0), .init(.init(some32: UInt32(id))))
                } else {
                    return Option32(tag: .init(rawValue: 1), .init(.init()))
                }
            },
            read_last_state: { _ in
                if let state = LastUpdateNotification.readLastState() {
                    return OptionSeen(tag: OptionSeen_Tag.init(rawValue: 0),
                                      .init(.init(some_seen: .init(rawValue: UInt32(state)))))
                } else {
                    return OptionSeen(tag: OptionSeen_Tag.init(rawValue: 1),
                                      .init(.init()))
                }
            },
            write_last: { _, id, state in
                LastUpdateNotification.write(id: Int(id), state: Int(state.rawValue))
            }
        )
        raw = new_update_notification(storage)
    }
    
    var showPush: Bool {
        get {
            return show_push(raw)
        }
    }
    
    var showInApp: Bool {
        get {
            return show_in_app(raw)
        }
    }
    
    func handleStartup() {
        handle_startup(raw)
    }
    
    func handleFirstRun() {
        handle_first_run(raw)
    }
    
    func handlePushSeen() {
        handle_push_seen(raw)
    }
    
    func handleInAppSeen() {
        handle_in_app_seen(raw)
    }
}
