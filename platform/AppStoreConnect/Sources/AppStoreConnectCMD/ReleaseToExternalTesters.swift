import ArgumentParser
import Foundation
import AppStoreConnect

extension AppStoreConnectCMD {
    struct ReleaseToExternalTesters: AsyncParsableCommand {
        static var configuration: CommandConfiguration = CommandConfiguration(abstract: "Distribute the given build to beta testers. Will wait until the build is processed by Apple, before distributing")
        
        @OptionGroup
        private var apiConfig: APIConfigArgs
        
        @Argument(help: "The target app's id. Will be used to lookup for the processed build on AppStoreConnect.")
        private var appBundleIdentifier: String
        
        @Argument(help: "The project's build version. Will be used to lookup for the processed build on AppStoreConnect.")
        private var buildVersion: String
        
        @Argument(help: "The project's build number. Will be used to lookup for the processed build on AppStoreConnect.")
        private var buildNumber: Int
        
        @Argument(help: "The external tester groups to distribute the build to.")
        private var externalTesterGroupIds: [String]
        
        func run() async throws {
            NSLog("""
            Releasing build to external testers:
            - App bundle identifier: \(appBundleIdentifier)
            - Build version: \(buildVersion)
            - Build number: \(buildNumber)
            - External tester groups: \(externalTesterGroupIds)
            """)
            
            let appStoreConnect = try AppStoreConnect(withConfigArgs: apiConfig)
            try await appStoreConnect.releaseBuildToExternalTesters(
                forApp: appBundleIdentifier,
                withVersion: buildVersion,
                buildNumber: buildNumber,
                groups: externalTesterGroupIds
            )
            
            NSLog("""
            Succesfully released build to external testers:
            - App bundle identifier: \(appBundleIdentifier)
            - Build version: \(buildVersion)
            - Build number: \(buildNumber)
            - External tester groups: \(externalTesterGroupIds)
            """)
        }
    }
}
