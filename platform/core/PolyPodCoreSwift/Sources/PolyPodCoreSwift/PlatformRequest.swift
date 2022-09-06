import MessagePack

enum PlatformRequest: String {
    case example
    
    static func from(value: MessagePackValue) -> Result<Self, CoreFailure> {
        Result {
            guard let result = try PlatformRequest.init(rawValue: value.getString()) else {
                throw DecodingError.invalidValue(
                    info: "Could not convert \(value) to PlatformRequest."
                )
            }
            return result
        }.mapError { error in
            CoreFailure(
                code: .failedToDecode,
                message: error.localizedDescription
            )
        }
    }
}

extension Core {
    static func handle(request: PlatformRequest) -> any Encodable {
        switch request {
        case .example:
            return Result<String, CoreFailure>.success("Test")
        }
    }
}
