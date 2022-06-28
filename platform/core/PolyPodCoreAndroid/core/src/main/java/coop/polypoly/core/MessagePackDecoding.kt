package coop.polypoly.core

import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

fun Value.getStringValue(): String? {
    if(isNilValue) {
        return null
    }
    return asStringValue().asString()
}

fun Value.getMapValue(): Map<Value, Value>? {
    if(isNilValue) {
        return null
    }
    return asMapValue().map()
}

fun mapError(msgObject: Map<Value, Value>): CoreFailure {
    val code = msgObject[ValueFactory.newString("code")]?.asIntegerValue()?.asInt()
    val message = msgObject[ValueFactory.newString("message")]?.asStringValue()?.asString()
    if (code != null && message != null) {
        CoreExceptionCode.getByValue(code)?.also {
            return CoreFailure(it, message = message)
        }
    }
    throw InvalidCoreErrorFormat(msgObject.toString())
}

fun mapFeatureManifest(msgObject: Value): FeatureManifest {
    val msgObject = msgObject.asMapValue().map() ?: throw EmptyFeatureManifest()

    val name = msgObject[ValueFactory.newString("name")]?.getStringValue()
    val author = msgObject[ValueFactory.newString("author")]?.getStringValue()
    val version = msgObject[ValueFactory.newString("version")]?.getStringValue()
    val description = msgObject[ValueFactory.newString("description")]?.getStringValue()
    val thumbnail = msgObject[ValueFactory.newString("thumbnail")]?.getStringValue()
    val thumbnailColor = msgObject[ValueFactory.newString("thumbnailColor")]?.getStringValue()
    val primaryColor = msgObject[ValueFactory.newString("primaryColor")]?.getStringValue()
    val borderColor = msgObject[ValueFactory.newString("borderColor")]?.getStringValue()
    val links = msgObject[ValueFactory.newString("links")]?.getMapValue()

    return FeatureManifest(
        name,
        author,
        version,
        description ,
        thumbnail,
        thumbnailColor,
        primaryColor,
        borderColor,
        links?.map { it.key.asStringValue().asString() to it.value.asStringValue().asString() }?.toMap()
    )
}
