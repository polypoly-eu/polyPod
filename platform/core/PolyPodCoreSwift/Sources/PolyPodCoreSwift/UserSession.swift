import MessagePack

public enum UserSessionTimeoutOption: String {
    case option1
    case option2
    case option3
    case noTimeout
}

public struct UserSessionTimeoutOptionConfig {
    let option: UserSessionTimeoutOption
    let duration: Int
}

extension UserSessionTimeoutOption {
    var messagePackValue: String {
        self.rawValue
    }
    
    static func from(msgPackValue value: MessagePackValue) throws -> UserSessionTimeoutOption {
        guard let option = UserSessionTimeoutOption(rawValue: try value.getString()) else {
            throw DecodingError.unknownUserSessionTimeoutOption(info: "Received msgPackValue \(value)")
        }
        return option
    }
}


extension UserSessionTimeoutOptionConfig {
    static func from(msgPackValue value: MessagePackValue) throws -> UserSessionTimeoutOptionConfig {
        let object: CoreResponseObject = try value.getDictionary()
        return try UserSessionTimeoutOptionConfig(
            option: UserSessionTimeoutOption.from(msgPackValue: object.get("option")),
            duration: object.get("duration").getInt())
    }
    
    static func mapUserSessionTimeoutOptionsConfig(_ value: MessagePackValue) throws -> [UserSessionTimeoutOptionConfig] {
        try value.getArray().map(UserSessionTimeoutOptionConfig.from(msgPackValue:))
    }
}
