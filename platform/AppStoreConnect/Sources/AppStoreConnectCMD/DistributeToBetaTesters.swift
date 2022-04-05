import ArgumentParser
import Foundation
import AppStoreConnect

extension AppStoreConnectCMD {
    struct DistributeToBetaTesters: AsyncParsableCommand {
        static var configuration: CommandConfiguration = CommandConfiguration(abstract: "Distribute the given build to beta testers. Will wait until the build is processed by Apple, before distributing")
        
        @OptionGroup
        private var apiConfig: APIConfigArgs
        
        @Argument(help: "The target app's id. Will be used to lookup for the processed build on AppStoreConnect.")
        private var appBundleIdentifier: String
        
        @Argument(help: "The project's build version. Will be used to lookup for the processed build on AppStoreConnect.")
        private var buildVersion: String
        
        @Argument(help: "The project's build number. Will be used to lookup for the processed build on AppStoreConnect.")
        private var buildNumber: Int
        
        @Argument(help: "The beta groups to distribute the build to")
        private var betaGroupIds: [String]
        
        func run() async throws {
            NSLog("""
            Distributing build:
            - App bundle identifier: \(appBundleIdentifier)
            - Build version: \(buildVersion)
            - Build number: \(buildNumber)
            - Beta groups: \(betaGroupIds)
            """)
            
            let appStoreConnect = AppStoreConnect(
                configuration: .init(
                    issuerID: apiConfig.appStoreKeyIssuerID,
                    privateKeyID: apiConfig.appStoreKeyID,
                    privateKey: try AppStoreConnect.cleanupPrivateKey(apiConfig.appStoreKey)
                )
            )
            try await appStoreConnect.distributeBetaBuild(withVersion: buildVersion,
                                                          buildNumber: buildNumber,
                                                          toBetaGroups: betaGroupIds,
                                                          forApp: appBundleIdentifier)
            
            NSLog("""
            Succesfully distrubuted build:
            - App bundle identifier: \(appBundleIdentifier)
            - Build version: \(buildVersion)
            - Build number: \(buildNumber)
            - Beta groups: \(betaGroupIds)
            """)
        }
    }
}
