import Foundation

public class UpdateNotification {
    public static var showPush: Bool {
        Core.instance
            .executeRequest(.shouldShowPushNotification)
            .inspectError {
                Log.error("shouldShowPushNotification request failed: \($0.localizedDescription)")
            }
            .unwrapOr(false)
    }

    public static var showInApp: Bool {
        Core.instance
            .executeRequest(.shouldShowInAppNotification)
            .inspectError {
                Log.error("shouldShowInAppNotification request failed: \($0.localizedDescription)")
            }
            .unwrapOr(false)
    }

    public static func handlePushSeen() {
        _ = Core.instance
            .executeRequest(.handlePushNotificationSeen)
            .inspectError {
                Log.error("handlePushNotificationSeen request failed: \($0.localizedDescription)")
            }
    }

    public static func handleInAppSeen() {
        _ = Core.instance
            .executeRequest(.handleInAppNotificationSeen)
            .inspectError {
                Log.error("handleInAppNotificationSeen request failed: \($0.localizedDescription)")
            }
    }
}
