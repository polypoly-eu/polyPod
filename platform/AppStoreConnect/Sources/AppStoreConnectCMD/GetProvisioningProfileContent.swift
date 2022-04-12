import ArgumentParser
import Foundation
import AppStoreConnect

extension AppStoreConnectCMD {
    struct GetProvisioningProfileContent: AsyncParsableCommand {
        static var configuration: CommandConfiguration = CommandConfiguration(abstract: "Retrieves the content of a given provisioning profile.")
        
        @OptionGroup
        private var apiConfig: APIConfigArgs
        
        @Argument(help: "The name of the provisioning profile to retrieve.")
        private var provisioningProfileName: String
        
        func run() async throws {
            let appStoreConnect = try AppStoreConnect(withConfigArgs: apiConfig)
            print(try await appStoreConnect.getProfileContent(forProvisioningProfile: provisioningProfileName))
        }
    }
}
