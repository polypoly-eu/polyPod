import UIKit

public protocol UpdateNotificationStore {
    func read() -> (Int, String)?
    func write(id: Int, state: String)
}

public class UpdateNotification {
    private enum State: String, CaseIterable {
        case NOT_SEEN
        case PUSH_SEEN
        case ALL_SEEN

        static func parse(_ s: String?) -> State? {
            guard let s = s else { return nil }
            for value in allCases where value.rawValue == s {
                return value
            }
            return nil
        }
    }

    private static var id: Int?
    private static var store: UpdateNotificationStore?
    private static var cachedState: State?
    private static var state: State {
        get { cachedState! }
        set {
            cachedState = newValue
            store!.write(id: id!, state: cachedState!.rawValue)
        }
    }

    private static func loadLastState() -> State {
        if id == 0 {
            return .ALL_SEEN
        }

        guard let (lastId, lastState) = Self.store!.read() else {
            return .NOT_SEEN
        }

        if id! < lastId {
            return .ALL_SEEN
        }

        if id != lastId {
            return .NOT_SEEN
        }

        return State.parse(lastState) ?? .ALL_SEEN
    }

    public static func initialize(id: Int, store: UpdateNotificationStore) {
        self.id = id
        self.store = store
        cachedState = Self.loadLastState()
    }

    public static var showPush: Bool {
        return state == .NOT_SEEN
    }

    public static var showInApp: Bool {
        return state != .ALL_SEEN
    }

    public static func handleStartup() {
        if state == .NOT_SEEN {
            state = .PUSH_SEEN
        }
    }

    public static func handleFirstRun() {
        state = .ALL_SEEN
    }

    public static func handlePushSeen() {
        if state == .NOT_SEEN {
            state = .PUSH_SEEN
        }
    }

    public static func handleInAppSeen() {
        state = .ALL_SEEN
    }
}
