import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]

enum PlatformRequest: String {
    case Example
}

enum PlatformResponse {
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
            let response = Result<PlatformResponse, Error> {
                let request_from_core = try unpackBytes(bytes: in_bytes)
                let platformRequest = try mapToPlatformRequest(request: request_from_core)
                return handle(platformRequest: platformRequest)
            }
            
            // TODO: Use CoreFailure for failures.
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
        featuresDirectory: String,
        forceShow: [FeatureCategoryId]
    ) -> Result<[FeatureCategory], Error> {
        var messagePackMap: [MessagePackValue: MessagePackValue] = [:]
        messagePackMap["features_dir"] = .string(featuresDirectory)
        messagePackMap["force_show"] =
            .array(forceShow.map { .string($0.rawValue) })
        let bytes = MessagePack.pack(MessagePackValue.map(messagePackMap))
            .toByteBuffer
        defer { bytes.data.deallocate() }
        return handleCoreResponse(
            load_feature_categories(bytes),
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

    // Not yet used, disable for now
//    public func executeRdfQuery(_ query: String) -> Result<MessagePackValue, Error> {
//        let query = NSString(string: query).utf8String!
//        return handleCoreResponse(exec_rdf_query(query), { $0 })
//    }
//
//    public func executeRdfUpdate(_ update: String) -> Result<MessagePackValue, Error> {
//        let update = NSString(string: update).utf8String!
//        return handleCoreResponse(exec_rdf_update(update), { $0 })
//    }

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
