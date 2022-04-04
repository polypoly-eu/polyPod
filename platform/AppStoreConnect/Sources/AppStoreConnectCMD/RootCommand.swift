import ArgumentParser

/// Root command for the command line tool
struct AppStoreConnectCMD: ParsableCommand {
    static var configuration: CommandConfiguration = CommandConfiguration(
        abstract: "A Swift command-line tool to execute commands against AppStoreConnect API",
        subcommands: [DistributeToBetaTesters.self]
    )
}
