import UIKit
import PolyPodCore

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
}
