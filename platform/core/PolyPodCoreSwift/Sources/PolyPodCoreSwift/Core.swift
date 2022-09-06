import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]


public struct LoadFeatureArguments: Encodable {
    public init(featuresDir: String, forceShow: [FeatureCategoryId]) {
        self.featuresDir = featuresDir
        self.forceShow = forceShow
    }
    
    let featuresDir: String
    let forceShow: [FeatureCategoryId]
}

public struct BootstrapArgs: Encodable {
    public init(languageCode: String, fsRoot: String) {
        self.languageCode = languageCode
        self.fsRoot = fsRoot
    }
    
    let languageCode: String
    let fsRoot: String
}

public enum CoreRequest: Encodable {
    case loadFeatureCategories(args: LoadFeatureArguments)
    case appDidBecomeInactive
    case isUserSessionExpired
    case setUserSessionTimeout(args: UserSessionTimeoutOption)
    case getUserSessionTimeoutOption
    case getUserSessionTimeoutOptionsConfig
    case executeRdfQuery(args: String)
    case executeRdfUpdate(args: String)
}

/// Swift wrapper around the Rust Core.
public final class Core {
    public static let instance = Core()
    
    private init() {}
    
    // MARK: - Public API
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    public func bootstrap(args: BootstrapArgs) -> Result<Void, Error> {
        let bridge = BridgeToPlatform(free_bytes: {
            $0?.deallocate()
        }, perform_request: { in_bytes in
            do {
                let request = try unpackBytes(bytes: in_bytes)
                    .flatMap(PlatformRequest.from)
                    .get()
                
                return Core
                    .handle(request: request)
                    .pack()
                    .toByteBuffer
            } catch {
                return Result<String, CoreFailure>
                    .failure(error as! CoreFailure)
                    .pack()
                    .toByteBuffer
            }
        })
        
        return handleCoreResponse(
            core_bootstrap(
                args.pack().toByteBuffer,
                bridge
            ), 
            { _ in }
        )
    }
    
    public func exec<T: MessagePackDecodable>(request: CoreRequest) -> Result<T, Error> {
        let bytes = request.pack().toByteBuffer;
        defer { bytes.data.deallocate() }
        return handleCoreResponse(execute_request(bytes), T.init(from:))
    }
    
    public func exec(request: CoreRequest) -> Result<Void, Error> {
        handleCoreResponse(execute_request(request.pack().toByteBuffer), { _ in })
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
