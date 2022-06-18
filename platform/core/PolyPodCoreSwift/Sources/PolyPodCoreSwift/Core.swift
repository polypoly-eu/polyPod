import PolyPodCore
import Foundation
import MessagePack

public enum MessagePackDecodingError: Error {
    case invalidValue(info: String)
    case invalidCoreFailure(info: String)
    case invalidCoreResult(info: String)
    case missingDictionaryKey(info: String)
    case invalidValueType(info: String)
    
    var localizedDescription: String {
        switch self {
        case .invalidValue(info: let info):
            return "Received invalid message pack value: \(info)"
        case .invalidCoreFailure(info: let info):
            return "Invalid core failure object format \(info)"
        case .invalidCoreResult(info: let info):
            return "Invalid core result object format \(info)"
        case .missingDictionaryKey(info: let info):
            return "Missing key in dictionary object: \(info)"
        case .invalidValueType(info: let info):
            return "Invalid value type: \(info)"
        }
    }
}

public enum CoreFailureCode: Int {
    case CoreNotBootstrapped = 1
    case CoreAlreadyBootstrapped
    case FailedToParseFeatureManifest
    case NullCStringPointer
    case FailedToCreateCString
}

public struct CoreFailure: Error {
    public let code: CoreFailureCode
    public let message: String
}

extension MessagePackValue {
    func getDictionary() throws -> [MessagePackValue: MessagePackValue] {
        if let dictionary = self.dictionaryValue {
            return dictionary
        } else {
            throw MessagePackDecodingError.invalidValue(info: "Expected dictionary")
        }
    }
    
    func getString() throws -> String? {
        guard self != nil else {
            return nil
        }
        if let string = self.stringValue {
            return string
        } else {
            throw MessagePackDecodingError.invalidValue(info: "Expected string")
        }
    }
}

/// Swift wrapper around the Rust Core. Encapsulates specific Pointer and Flabuffer operations.
public final class Core {
    public static let instance = Core()
    
    // MARK: - Private config
    private var languageCode: UnsafePointer<CChar>!
    
    private init() {}
    
    // MARK: - Public API
    
    /// Prepares the core to be used
    /// Should be called before invoking any other API
    public func bootstrap(languageCode: String) -> Result<Void, Error> {
        // Force unwrap should be safe
        self.languageCode = NSString(string: languageCode).utf8String!
       
        return Result {
            let responseBytes = core_bootstrap(languageCode)
            defer {
                free_bytes(responseBytes.data)
            }
            let responseObject = try getResponseObject(responseBytes)
            if responseObject["Ok"] != nil {
                return ()
            } else if let failure = try responseObject["Err"]?.getDictionary() {
                throw try mapError(failure)
            } else {
                throw MessagePackDecodingError.invalidCoreResult(info: "Received \(responseObject)")
            }
        }
    }
    
    /// Parse the FeatureManifest from the given json
    /// - Parameter json: Raw JSON to parse the FeatureManifest from
    /// - Returns: A FeatureManifest if parsing succeded, nil otherwise
    public func parseFeatureManifest(json: String) -> Result<FeatureManifest, Error> {
        Result {
            let responseBytes = parse_feature_manifest_from_json(json)
            let responseObject = try getResponseObject(responseBytes)
            defer {
                free_bytes(responseBytes.data)
            }
            if let manifestObject = try responseObject["Ok"]?.getDictionary() {
                return try mapFeatureManifest(manifestObject)
            } else if let failure = try responseObject["Err"]?.getDictionary() {
                throw try mapError(failure)
            } else {
                throw MessagePackDecodingError.invalidCoreResult(info: "Received \(responseObject)")
            }
        }
    }
    
    func getResponseObject(_ cByteBuffer: CByteBuffer) throws -> [MessagePackValue: MessagePackValue] {
        let buffer = UnsafeBufferPointer(start: cByteBuffer.data, count: Int(cByteBuffer.length))
        let data = Data(buffer: buffer)
        
        let unpack = try MessagePack.unpackFirst(data)
        return try unpack.getDictionary()
    }
    
    func mapError(_ dict: [MessagePackValue: MessagePackValue]) throws -> CoreFailure {
        guard let code = dict["code"]?.intValue.flatMap(CoreFailureCode.init),
              let message = dict["message"]?.stringValue else {
            throw MessagePackDecodingError.invalidCoreFailure(info: "Received \(dict)")
        }
        
        return CoreFailure(code: code, message: message)
    }
    
    func mapFeatureManifest(_ dictionary: [MessagePackValue: MessagePackValue]) throws -> FeatureManifest {
        return FeatureManifest(name: try dictionary["name"]?.getString(),
                               author: try dictionary["author"]?.getString(),
                               version: try dictionary["version"]?.getString(),
                               description: try dictionary["description"]?.getString(),
                               thumbnail: try dictionary["thumbnail"]?.getString(),
                               thumbnailColor: try dictionary["thumbnail_color"]?.getString(),
                               primaryColor: try dictionary["primary_color"]?.getString(),
                               links: try dictionary["links"]?.getDictionary() as? [String: String])
    }
}
