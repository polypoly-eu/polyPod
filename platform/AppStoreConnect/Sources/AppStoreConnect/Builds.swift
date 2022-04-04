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
    ///   - version: The version of the build to look for
    ///   - buildNumber: The build number for the given version to look for
    ///   - appID: The id of the app for which to search the build for
    /// - Returns: The processed build if found, or throws error if something failed
    func waitUntilBuildIsProcessed(forVersion version: String,
                                   buildNumber: Int,
                                   forApp appID: String) throws -> Build {
        let maxNumberOfRequests = 10
        let processingBuildCheckInterval: TimeInterval = 20
        var requestsCount = 0
        
        var result: Result<Build, Error> = .failure(AppStoreConnectError.buildNotFound)
        let semaphore = DispatchSemaphore(value: 0)
        func setResult(_ capturedResult: Result<Build, Error>, timer: Timer) {
            result = capturedResult
            timer.invalidate()
            semaphore.signal()
        }
        
        Timer.scheduledTimer(withTimeInterval: processingBuildCheckInterval,
                             repeats: true) { timer in
            guard requestsCount <= maxNumberOfRequests else {
                setResult(.failure(AppStoreConnectError.buildNotFound), timer: timer)
                return
            }
            requestsCount += 1
            do {
                let result = try self.findBuild(forVersion: version, buildNumber: buildNumber, forApp: appID)
                switch result {
                case .notYetUploaded:
                    NSLog("Build is not yet uploaded...")
                case .processing:
                    NSLog("Build is still processing...")
                case .invalid:
                    setResult(.failure(AppStoreConnectError.invalidBuild), timer: timer)
                case .failed:
                    setResult(.failure(AppStoreConnectError.buildProcessingFailed), timer: timer)
                case .valid(let build):
                    setResult(.success(build), timer: timer)
                }
            } catch {
                setResult(.failure(error), timer: timer)
            }
        }.fire()
        semaphore.wait()
        return try result.get()
    }
    
    /// Finds the given build or the its attached status.
    /// - Parameters:
    ///   - version: The version of the build to look for
    ///   - buildNumber: The build number for the given version to look for
    ///   - appID: The id of the app for which to search the build for
    /// - Returns: The build status if found, or throws error if something failed
    func findBuild(forVersion version: String,
                   buildNumber: Int,
                   forApp appID: String) throws -> BuildStatus {
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
        let buildsResponse = try apiProvider.request(buildEndpoint)
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
