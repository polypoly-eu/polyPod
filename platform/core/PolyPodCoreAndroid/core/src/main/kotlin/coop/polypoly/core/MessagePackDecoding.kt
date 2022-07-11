package coop.polypoly.core

import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

fun Value.getStringValue(): String? {
    if (isNilValue) {
        return null
    }

    return asStringValue().asString()
}

fun Value.getMapValue(): Map<Value, Value>? {
    if (isNilValue) {
        return null
    }

    return asMapValue().map()
}

fun Map<Value, Value>.get(key: String): Value? {
    return this[ValueFactory.newString(key)]
}

fun mapError(msgObject: Map<Value, Value>): CoreFailure {
    val code = msgObject.get("code")?.asIntegerValue()?.asInt()
    val message = msgObject.get("message")?.asStringValue()?.asString()
    if (code != null && message != null) {
        CoreExceptionCode.getByValue(code)?.also {
            return CoreFailure(it, message)
        }
    }
    throw InvalidCoreErrorFormat(msgObject.toString())
}

fun mapFeatureManifest(msgObject: Value): FeatureManifest {
    val msgObject = msgObject.asMapValue().map() ?: throw EmptyFeatureManifest()

    val name = msgObject.get("name")?.getStringValue()
    val author = msgObject.get("author")?.getStringValue()
    val version = msgObject.get("version")?.getStringValue()
    val description = msgObject.get("description")?.getStringValue()
    val thumbnail = msgObject.get("thumbnail")?.getStringValue()
    val thumbnailColor = msgObject.get("thumbnailColor")?.getStringValue()
    val primaryColor = msgObject.get("primaryColor")?.getStringValue()
    val borderColor = msgObject.get("borderColor")?.getStringValue()
    val tileTextColor = msgObject.get("tileTextColor")?.getStringValue()
    val links = msgObject.get("links")?.getMapValue()

    return FeatureManifest(
        name,
        author,
        version,
        description,
        thumbnail,
        thumbnailColor,
        primaryColor,
        borderColor,
        tileTextColor,
        links?.map {
            it.key.asStringValue().asString() to
                it.value.asStringValue().asString()
        }?.toMap()
    )
}
