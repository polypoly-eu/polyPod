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
    
    static var isProduction: Bool {
        !(isDebug || isRunningInTestFlightEnvironment)
    }
    
    static var isDebug: Bool {
        #if DEBUG
            return true
        #else
            return false
        #endif
    }
    
    private static var isRunningInTestFlightEnvironment: Bool {
        isAppStoreReceiptSandbox && !hasEmbeddedMobileProvision
    }
    
    private static var isAppStoreReceiptSandbox: Bool {
        Bundle.main.appStoreReceiptURL?.lastPathComponent == "sandboxReceipt"
    }
    
    private static var hasEmbeddedMobileProvision: Bool {
        Bundle.main.path(forResource: "embedded", ofType: "mobileprovision") != nil
    }
}
