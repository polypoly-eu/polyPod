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
    case EmptyResponse
}

public struct CoreFailure: Error {
    public let code: CoreFailureCode
    public let message: String
}

extension CoreFailure {
    static var emptyResponse: Self {
        CoreFailure(code: .EmptyResponse, message: "Recevied empty response from core")
    }
}
