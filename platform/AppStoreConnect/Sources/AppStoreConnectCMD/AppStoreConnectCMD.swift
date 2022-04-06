import ArgumentParser
import AppStoreConnect
import AppStoreConnect_Swift_SDK
import Foundation

/// Root command for the command line tool
struct AppStoreConnectCMD: ParsableCommand {
    static var configuration: CommandConfiguration = CommandConfiguration(
        abstract: "A Swift command-line tool to execute commands against AppStoreConnect API",
        subcommands: [ReleaseToExternalTesters.self]
    )
    
    struct APIConfigArgs: ParsableArguments {
        @Argument(help: "Issuer ID for the app store key. Will be used to connect to AppStoreConnect.")
        var appStoreKeyIssuerID: String
        
        @Argument(help: "ID of the app store key. Will be used to connect to AppStoreConnect.")
        var appStoreKeyID: String
        
        @Argument(help: "The path to the .p8 file storing the app store key. Will be used to connect to AppStoreConnect.")
        var appStoreKeyPath: String
    }
}
