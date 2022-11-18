import PolyPodCore
import Foundation
import MessagePack

typealias CoreResponseObject = [MessagePackValue: MessagePackValue]

public struct BootstrapArgs: Encodable {
    public init(
        languageCode: String,
        fsRoot: String,
        updateNotificationId: Int
    ) {
        self.languageCode = languageCode
        self.fsRoot = fsRoot
        self.updateNotificationId = updateNotificationId
    }
    
    let languageCode: String
    let fsRoot: String
    let updateNotificationId: Int
}

/// Swift wrapper around the Rust Core.
public final class Core {
    public static let instance = Core()
    public var log: CoreLog?
    
    private init() {}
    
    // MARK: - Public API
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    public func bootstrap(args: BootstrapArgs) -> Result<Void, Error> {
        return handleCoreResponse(
            core_bootstrap(
                args.pack().toByteBuffer,
                BridgeToPlatform.make()
            ), 
            { _ in }
        )
    }
    
    public func executeRequest<T: MessagePackDecodable>(_ request: CoreRequest) -> Result<T, Error> {
        let bytes = request.pack().toByteBuffer;
        defer { bytes.data.deallocate() }
        return handleCoreResponse(execute_request(bytes), T.init(from:))
    }
    
    public func executeRequest(_ request: CoreRequest) -> Result<Void, Error> {
        let bytes = request.pack().toByteBuffer;
        defer { bytes.data.deallocate() }
        return handleCoreResponse(execute_request(bytes), { _ in })
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
            } else if let failure = responseObject["Err"] {
                throw try CoreFailure(from: failure)
            }
            
            throw DecodingError.invalidResponse(info: "\(String(describing: responseObject))")
        }
    }
}

extension BridgeToPlatform {
    static func make() -> Self {
        BridgeToPlatform(free_bytes: {
            $0?.deallocate()
        }, perform_request: { in_bytes in
            do {
                let request = try unpackBytes(bytes: in_bytes)
                    .flatMap { value in
                        Result { try PlatformRequest(from: value) }
                    }
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
    }
}
