import MessagePack

enum PlatformRequest: String {
    case example
    
    init(from value: MessagePackValue) throws {
        guard let result = try PlatformRequest(rawValue: value.getString()) else {
            throw CoreFailure(
                code: .failedToDecode,
                message: "Could not convert \(value) to PlatformRequest"
            )
        }
        self = result
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
