import Foundation

struct RuntimeInfo {
    static let name = "polyPod for iOS"
    
    static var version: String {
        guard let info = Bundle.main.infoDictionary else {
            return "Unknown"
        }
        let marketingVersion = info["CFBundleShortVersionString"] ?? "Unknown"
        let buildNumber = info["CFBundleVersion"] ?? "Unknown"
        return "\(marketingVersion) (\(buildNumber))"
    }
}
