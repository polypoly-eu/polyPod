import UIKit

private class LastUpdateNotification {
    private static let idKey = UserDefaults.Keys
        .lastUpdateNotificationId.rawValue
    private static let stateKey = UserDefaults.Keys
        .lastUpdateNotificationState.rawValue
    
    static func read() -> (Int, String)? {
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
    
    static func write(id: Int, state: String) {
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
    private enum State: String, CaseIterable {
        case NOT_SEEN
        case PUSH_SEEN
        case ALL_SEEN
        
        static func parse(_ s: String?) -> State? {
            guard let s = s else { return nil }
            for value in allCases {
                if value.rawValue == s {
                    return value
                }
            }
            return nil
        }
    }
    
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
            let defaultLanguage = "en"
            let userLanguage = Locale.current.languageCode ?? defaultLanguage
            return values[userLanguage] ?? values[defaultLanguage]!
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
        
    private static func loadLastState(_ id: Int) -> State {
        if id == 0 {
            return .ALL_SEEN
        }
        
        guard let (lastId, lastState) = LastUpdateNotification.read() else {
            return .NOT_SEEN
        }
        
        if id < lastId {
            return .ALL_SEEN
        }
        
        if id != lastId {
            return .NOT_SEEN
        }
        
        return State.parse(lastState) ?? .ALL_SEEN
    }
    
    let id = UpdateNotificationMockId.read() ?? notificationData.id
    let pushDelay = notificationData.pushDelay
    let title = notificationData.localizedTitle
    let text = notificationData.localizedText
    
    private var cachedState: State
    private var state: State {
        get { cachedState }
        set {
            cachedState = newValue
            LastUpdateNotification.write(id: id, state: cachedState.rawValue)
        }
    }
    
    init() {
        cachedState = UpdateNotification.loadLastState(id)
    }
    
    var showPush: Bool {
        get {
            return state == .NOT_SEEN
        }
    }
    
    var showInApp: Bool {
        get {
            return state != .ALL_SEEN
        }
    }
    
    func onStartup() {
        onPushSeen()
    }
    
    func onFirstRun() {
        onInAppSeen()
    }
    
    func onPushSeen() {
        if state == .NOT_SEEN {
            state = .PUSH_SEEN
        }
    }
    
    func onInAppSeen() {
        state = .ALL_SEEN
    }
}
