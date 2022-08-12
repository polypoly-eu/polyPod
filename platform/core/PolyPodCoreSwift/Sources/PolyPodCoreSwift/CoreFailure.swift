public enum DecodingError: Error {
    case invalidValue(info: String)
    case invalidCoreFailure(info: String)
    case invalidCoreResult(info: String)
    case missingDictionaryKey(info: String)
    case invalidValueType(info: String)
    case invalidResponse(info: String?)
    case invalidFeatureCategoryFormat
    case unknownFeatureCategoryId(info: String)
    
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
        }
    }
}

#warning("Out of date. Needs to be updated.")
public enum CoreFailureCode: Int {
    case coreNotBootstrapped = 1
    case coreAlreadyBootstrapped
    case failedToParseFeatureManifest
    case nullCStringPointer
    case failedToCreateCString
    case failedToCreateJavaString
    case failedToConvertJavaString
}

public struct CoreFailure: Error, Equatable {
    public let code: CoreFailureCode
    public let message: String
}
