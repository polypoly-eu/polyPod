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
        if isDebug || isRunningInTestFlightEnvironment {
            return false
        }
        
        return true
    }
    
    static var isDebug: Bool {
        #if DEBUG
            return true
        #else
            return false
        #endif
    }
    
    private static var isRunningInTestFlightEnvironment: Bool {
        if isAppStoreReceiptSandbox && !hasEmbeddedMobileProvision {
            return true
        } else {
            return false
        }
    }
    
    private static var isAppStoreReceiptSandbox: Bool {
        guard let url = Bundle.main.appStoreReceiptURL else {
            return false
        }
        guard url.lastPathComponent == "sandboxReceipt" else {
            return false
        }
        return true
    }
    
    private static var hasEmbeddedMobileProvision: Bool {
        guard Bundle.main.path(forResource: "embedded", ofType: "mobileprovision") == nil else {
            return true
        }
        return false
    }
}
