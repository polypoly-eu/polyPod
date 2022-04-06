import AppStoreConnect_Swift_SDK
import Foundation

enum BuildStatus {
    case notYetUploaded
    case processing
    case invalid
    case failed
    case valid(Build)
}

extension AppStoreConnect {
    
    /// Waits until a given build is processed and is ready to be used.
    /// - Parameters:
    ///   - appID: The id of the app for which to search the build for
    ///   - version: The version of the build to look for
    ///   - buildNumber: The build number for the given version to look for
    /// - Returns: The processed build if found, or throws error if something failed
    func buildIsProcessed(forAppID appID: String,
                          withVersion version: String,
                          buildNumber: Int) async throws -> Build {
        let maxNumberOfRequests = 5
        // Check every minute. Some processing can go fast, other slower.
        let processingBuildCheckInterval: UInt64 = 60*1_000_000_000 // 60 seconds/1 minute
        var requestsCount = 0
        
        while requestsCount <= maxNumberOfRequests {
            let result = try await self.findBuild(
                forAppID: appID,
                withVersion: version,
                buildNumber: buildNumber
            )
            requestsCount += 1
            
            switch result {
            case .notYetUploaded:
                NSLog("Build is not yet uploaded...")
            case .processing:
                NSLog("Build is still processing...")
            case .invalid:
                throw AppStoreConnectError.invalidBuild
            case .failed:
                throw AppStoreConnectError.buildProcessingFailed
            case .valid(let build):
                return build
            }
            try await Task.sleep(nanoseconds: processingBuildCheckInterval)
        }
        
        NSLog("Exceeded max number of requests, build was not found.")
        throw AppStoreConnectError.buildNotFound
    }
    
    /// Finds the given build or the its attached status.
    /// - Parameters:
    ///   - appID: The id of the app for which to search the build for
    ///   - version: The version of the build to look for
    ///   - buildNumber: The build number for the given version to look for
    /// - Returns: The build status if found, or throws error if something failed
    func findBuild(forAppID appID: String,
                   withVersion version: String,
                   buildNumber: Int) async throws -> BuildStatus {
        let buildEndpoint = APIEndpoint<BuildsResponse>.builds(
            fields: [
                .builds([.processingState])
            ],
            filter: [
                .app([appID]),
                .preReleaseVersionVersion([version]),
                .version(["\(buildNumber)"])
            ]
        )
        let buildsResponse = try await apiProvider.request(buildEndpoint)
        guard let build = buildsResponse.data.first else {
            return .notYetUploaded
        }
        if let processingState = build.attributes?.processingState {
            switch processingState {
            case "PROCESSING":
                return .processing
            case "VALID":
                return .valid(build)
            case "INVALID":
                return .invalid
            case "FAILED":
                return .failed
            default:
                throw AppStoreConnectError.unknownProcessingState(processingState)
            }
        } else {
            // This is either the request config error, or that the AppStoreConnect API changed.
            throw AppStoreConnectError.missingProcessingState
        }
    }
}
