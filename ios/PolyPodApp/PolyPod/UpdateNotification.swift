import Foundation

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
    
    // TODO: Don't hard code the following
    static let id = UpdateNotificationMockId.read() ?? 79205050
    static let pushDelay = 120
    static let title = "Notification system test"
    static let text = """
This is a test of the update notification system - if you see it,
please tell fhd about it - and try to remember whether this was a fresh
installation of the app, or if you previously had it installed.
"""
    
    private static var cachedState: State = loadLastState(id)
    private static var state: State {
        get { cachedState }
        set {
            cachedState = newValue
            LastUpdateNotification.write(id: id, state: cachedState.rawValue)
        }
    }
    
    private static func loadLastState(_ id: Int) -> State {
        if id == 0 {
            return .ALL_SEEN
        }
        
        guard let (lastId, lastState) = LastUpdateNotification.read() else {
            return .NOT_SEEN
        }
        
        if id != lastId {
            return .NOT_SEEN
        }
        
        return State.parse(lastState) ?? .ALL_SEEN
    }
        
    static func showPush() -> Bool {
        return state == .NOT_SEEN
    }
    
    static func showInApp() -> Bool {
        return state != .ALL_SEEN
    }
    
    static func onStartup() {
        onShowPush()
    }
    
    static func onFirstRun() {
        onShowInApp()
    }
    
    static func onShowPush() {
        if state == .NOT_SEEN {
            state = .PUSH_SEEN
        }
    }
    
    static func onShowInApp() {
        state = .ALL_SEEN
    }
    
    private init() {}
}
