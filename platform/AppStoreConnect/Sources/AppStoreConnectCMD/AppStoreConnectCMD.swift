import ArgumentParser
import AppStoreConnect
import AppStoreConnect_Swift_SDK
import Foundation

/// Root command for the command line tool
struct AppStoreConnectCMD: ParsableCommand {
    static var configuration: CommandConfiguration = CommandConfiguration(
        abstract: "A Swift command-line tool to execute commands against AppStoreConnect API",
        subcommands: [DistributeToBetaTesters.self]
    )
    
    struct APIConfigArgs: ParsableArguments {
        @Argument(help: "The target app's id. Will be used to lookup for the processed build on AppStoreConnect.")
        var appStoreKeyIssuerID: String
        
        @Argument(help: "The project's build version. Will be used to lookup for the processed build on AppStoreConnect.")
        var appStoreKeyID: String
        
        @Argument(help: "The project's build number. Will be used to lookup for the processed build on AppStoreConnect.")
        var appStoreKey: String
    }
}
