import MessagePack

public enum UserSessionTimeoutOption: String, CaseIterable, Encodable {
    case option1
    case option2
    case option3
    case noTimeout
}

public struct UserSessionTimeoutOptionConfig {
    public let option: UserSessionTimeoutOption
    public let duration: UInt?
}

extension UserSessionTimeoutOption {
    var messagePackValue: MessagePackValue {
        MessagePackValue(self.rawValue)
    }
    
    static func from(
        msgPackValue value: MessagePackValue
    ) throws -> UserSessionTimeoutOption {
        guard let option = UserSessionTimeoutOption(rawValue: try value.getString()) else {
            throw DecodingError
                .unknownUserSessionTimeoutOption(info: "Received msgPackValue \(value)")
        }
        return option
    }
}


extension UserSessionTimeoutOptionConfig {
    static func from(msgPackValue value: MessagePackValue) throws -> UserSessionTimeoutOptionConfig {
        let object: CoreResponseObject = try value.getDictionary()
        return try UserSessionTimeoutOptionConfig(
            option: UserSessionTimeoutOption.from(msgPackValue: object.get("option")),
            duration: object.get("duration").getUInt()
        )
    }
    
    static func mapUserSessionTimeoutOptionsConfig(
        _ value: MessagePackValue
    ) throws -> [UserSessionTimeoutOptionConfig] {
        try value.getArray().map(UserSessionTimeoutOptionConfig.from(msgPackValue:))
    }
}
