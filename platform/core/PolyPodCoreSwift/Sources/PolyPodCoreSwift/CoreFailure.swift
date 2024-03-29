import MessagePack
public enum DecodingError: Error {
    case invalidValue(info: String)
    case invalidCoreFailure(info: String)
    case invalidCoreResult(info: String)
    case missingDictionaryKey(info: String)
    case invalidValueType(info: String)
    case invalidResponse(info: String?)
    case invalidFeatureCategoryFormat
    case unknownFeatureCategoryId(info: String)
    case unknownUserSessionTimeoutOption(info: String)
    
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
        case let .invalidResponse(info):
            return "Received invalid core response: \(String(describing: info))"
        case .invalidFeatureCategoryFormat:
            return "Expected dictionary for feature category"
        case let .unknownFeatureCategoryId(info):
            return "Unknown FeatureCategoryId: \(info)"
        case let .unknownUserSessionTimeoutOption(info):
            return "Unknown UserSessionTimeoutOption: \(info)"
        }
    }
}

public enum CoreFailureCode: Int, Codable {
    case coreNotBootstrapped = 1
    case coreAlreadyBootstrapped
    case failedToParseFeatureManifest
    case nullCStringPointer
    case failedToCreateCString
    case failedToExtractJavaString
    case failedToConvertJavaString
    case failedToParseFeatureCategoriesJSON
    case failedToReadFile
    case failedFileSystemOperation
    case failedToParseURL
    case failedToUnzip
    case failedToCreateFeatureFilesPath
    case failedToConvertToFsPath
    case failedToConvertToResourceUrl
    case failedToGetFilePath
    case failedToGetLastSegmentFromUrl
    case failedToDecodeByteArray
    case failedToReadByteBufferLength
    case failedToExtractJObject
    case failedToExtractBytes
    case failedToCallJNIMethod
    case failedToConvertBytes
    case failedToAccessUserSession
    case failedToAttachJVM
    case failedToDecode
    case failedToEncode
    case failedToSetPreference
    
    init(from value: MessagePackValue) throws {
        guard let code = CoreFailureCode.init(rawValue: try value.getInt()) else {
            throw DecodingError.invalidCoreFailure(info: "Received \(value)")
        }
        self = code
    }
}

public struct CoreFailure: Error, Codable {
    public let code: CoreFailureCode
    public let message: String
    
    public init(code: CoreFailureCode, message: String) {
        self.code = code
        self.message = message
    }
    
    init(from value: MessagePackValue) throws {
        let dict: [MessagePackValue: MessagePackValue] = try value.getDictionary()
        code = try CoreFailureCode(from: dict.get("code"))
        message = try dict.get("message").getString()
    }
}
