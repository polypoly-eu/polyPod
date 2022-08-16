import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]

enum PlatformRequest: String {
    case Example
}

enum PlatformResponse: Codable {
    case Example(String)
}

/// Swift wrapper around the Rust Core.
public final class Core {
    public static let instance = Core()
    
    // MARK: - Private config
    private var languageCode: UnsafePointer<CChar>!
    private var fsRoot: UnsafePointer<CChar>!
    
    private init() {}
    
    // MARK: - Public API
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    public func bootstrap(languageCode: String, fsRoot: String) -> Result<Void, Error> {
        // Force unwrap should be safe
        self.languageCode = NSString(string: languageCode).utf8String!
        self.fsRoot = NSString(string: fsRoot).utf8String!

        let bridge = BridgeToPlatform(free_bytes: {
            $0?.deallocate()
        }, perform_request: { in_bytes in
            let response: Result<PlatformResponse, CoreFailure> = unpackBytes(bytes: in_bytes)
                .flatMap(mapToPlatformRequest(request:))
                .map(handle(platformRequest:))
            
            return packPlatformResponse(response: response).toByteBuffer
        })

        return handleCoreResponse(
            core_bootstrap(
                self.languageCode, 
                self.fsRoot, 
                bridge
            ), 
            { _ in }
        )
    }

    /// Loads the feature categories from the given features directory
    /// - Parameter featuresDirectory: Directory from which to load the feature categories.
     /// - Returns: A Result for loading operation.
    public func loadFeatureCategories(
        featuresDirectory: String
    ) -> Result<[FeatureCategory], Error> {
        let features_dir = NSString(string: featuresDirectory).utf8String!
        return handleCoreResponse(
            load_feature_categories(features_dir),
            mapFeatureCategories
        )
    }
    
    public func appDidBecomeInactive() -> Result<Void, Error> {
        handleCoreResponse(app_did_become_inactive(), { _ in })
    }
    
    public func isUserSessionExpired() -> Result<Bool, Error> {
        handleCoreResponse(is_user_session_expired()) { try $0.getBool() }
    }
    
    public func setUserSessionTimeout(option: UserSessionTimeoutOption) -> Result<Void, Error> {
        let data = MessagePack.pack(option.messagePackValue).toByteBuffer
        return handleCoreResponse(
            set_user_session_timeout_option(
                data,
                { $0?.deallocate() }
            )
        ) { _ in }
    }
    
    public func getUserSessionTimeoutOption() -> Result<UserSessionTimeoutOption, Error> {
        handleCoreResponse(
            get_user_session_timeout_option(),
            UserSessionTimeoutOption.from(msgPackValue:)
        )
    }
    
    public func getUserSessionTimeoutOptionsConfig() -> Result<[UserSessionTimeoutOptionConfig], Error> {
        handleCoreResponse(get_user_session_timeout_options_config(), UserSessionTimeoutOptionConfig.mapUserSessionTimeoutOptionsConfig(_:))
    }

    // MARK: - Internal API

    func handleCoreResponse<T>(
        _ byte_response: CByteBuffer,
        _ map: (MessagePackValue) throws -> T
    ) -> Result<T, Error> {
        Result {
            defer {
                free_bytes(byte_response.data)
            }
            
            let buffer = UnsafeBufferPointer(
                start: byte_response.data,
                count: Int(byte_response.length)
            )
            let data = Data(buffer: buffer)
            
            let responseObject: CoreResponseObject = try MessagePack.unpackFirst(data).getDictionary()
            
            if let responseObject = responseObject["Ok"] {
                return try map(responseObject)
            } else if let failure = try responseObject["Err"]?.getDictionary() {
                throw try mapError(failure)
            }
            
            throw DecodingError.invalidResponse(info: "\(String(describing: responseObject))")
        }
    }
}
