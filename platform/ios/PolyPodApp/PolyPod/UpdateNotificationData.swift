import UIKit

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

class UpdateNotificationData {
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
            return Self.readLocalizedValue(self.title)
        }

        var localizedText: String {
            return Self.readLocalizedValue(self.text)
        }
    }

    private static let notificationData = Data.load()
    let id = UpdateNotificationMockId.read() ?? notificationData.id
    let pushDelay = notificationData.pushDelay
    let title = notificationData.localizedTitle
    let text = notificationData.localizedText
}
