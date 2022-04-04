import ArgumentParser
import Foundation

struct DistributeToBetaTesters: ParsableCommand {
    static var configuration: CommandConfiguration = CommandConfiguration(abstract: "Distribute the given build to beta testers. Will wait until the build is processed by Apple, before distributing")
    
    @Argument(help: "The target app's id. Will be used to lookup for the processed build on AppStoreConnect.")
    private var appID: String
    
    @Argument(help: "The project's build version. Will be used to lookup for the processed build on AppStoreConnect.")
    private var buildVersion: String
    
    @Argument(help: "The project's build number. Will be used to lookup for the processed build on AppStoreConnect.")
    private var buildNumber: Int
    
    @Argument(help: "The beta groups to distribute the build to")
    private var betaGroupIds: [String]
    
    func run() throws {
        NSLog("""
            Distributing build:
            - App id: \(appID)
            - Build version: \(buildVersion)
            - Build number: \(buildNumber)
            - Beta groups: \(betaGroupIds)
            """)
        
        try appStoreConnect.distributeBetaBuild(withVersion: buildVersion,
                                                buildNumber: buildNumber,
                                                toBetaGroups: betaGroupIds,
                                                forApp: appID)
        
        NSLog("""
            Succesfully distrubuted build:
            - App id: \(appID)
            - Build version: \(buildVersion)
            - Build number: \(buildNumber)
            - Beta groups: \(betaGroupIds)
            """)
    }
}
