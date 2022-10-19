import Foundation

public class UpdateNotification {
    public static var showPush: Bool {
        let result: Result<Bool, Error> = Core.instance.executeRequest(.shouldShowPushNotification)
        switch result {
        case .success(let value):
            return value
        case .failure(let error):
            print("shouldShowPushNotification request failed: \(error.localizedDescription)")
            return false
        }
    }

    public static var showInApp: Bool {
        let result: Result<Bool, Error> = Core.instance.executeRequest(.shouldShowInAppNotification)
        switch result {
        case .success(let value):
            return value
        case .failure(let error):
            print("shouldShowInAppNotification request failed: \(error.localizedDescription)")
            return false
        }
    }

    public static func handlePushSeen() {
        switch Core.instance.executeRequest(.handlePushNotificationSeen) {
        case .success:
            break
        case .failure(let error):
            print("handlePushNotification request failed: \(error.localizedDescription)")
        }
    }

    public static func handleInAppSeen() {
        switch Core.instance.executeRequest(.handleInAppNotificationSeen) {
        case .success:
            break
        case .failure(let error):
            print("handleInAppNotificationSeen request failed: \(error.localizedDescription)")
        }
    }
}
