import AppStoreConnect_Swift_SDK
import Foundation

public enum AppStoreConnectError: Error {
    case buildProcessingFailed
    case invalidBuild
    case unknownProcessingState(String)
    case missingProcessingState
    case buildNotFound
    case appNotFound
}

// A facade for AppStoreConnect_Swift_SDK.APIProvider that manages multiple requests
public final class AppStoreConnect {
    
    let apiProvider: APIProvider
    
    /// Create an instance
    /// - Parameter configuration: The app specific configuration used to acess the AppStoreConnect
    public init(configuration: APIConfiguration) {
        self.apiProvider = APIProvider(configuration: configuration)
    }
}
