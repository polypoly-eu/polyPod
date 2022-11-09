package coop.polypoly.core

import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

enum class UserSessionTimeoutOption {
    option1,
    option2,
    option3,
    noTimeout;

    companion object {
        fun from(msgPackValue: Value): UserSessionTimeoutOption {
            return valueOf(msgPackValue.toString())
        }
    }

    fun asValue(): Value {
        return ValueFactory.newString(this.name)
    }
}

data class UserSessionTimeoutOptionConfig(
    val option: UserSessionTimeoutOption,
    val duration: Int?
) {
    companion object {
        fun from(msgPackValue: Value): UserSessionTimeoutOptionConfig {
            val map = msgPackValue.asMapValue().map()
            return UserSessionTimeoutOptionConfig(
                UserSessionTimeoutOption.from(map.getValue("option")),
                map.get("duration")?.asOptionalInt()
            )
        }

        fun mapConfigs(msgPackValue: Value):
            List<UserSessionTimeoutOptionConfig> {
            return msgPackValue.asArrayValue().map {
                from(it)
            }
        }
    }
}
