import AppStoreConnect
import AppStoreConnect_Swift_SDK
import Foundation

extension AppStoreConnect {
    convenience init(withConfigArgs args: AppStoreConnectCMD.APIConfigArgs) throws {
        let privateKey = try String(contentsOf: URL(fileURLWithPath: args.appStoreKeyPath))
        let config = APIConfiguration(
            issuerID: args.appStoreKeyIssuerID,
            privateKeyID: args.appStoreKeyID,
            privateKey: try AppStoreConnect.cleanupPrivateKey(privateKey)
        )
        self.init(configuration: config)
    }
}
