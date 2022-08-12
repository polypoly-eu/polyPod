package coop.polypoly.core

import android.graphics.Color
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

fun Value.getIntValue(): Int? {
    if (isNilValue) {
        return null
    }

    return asIntegerValue().asInt()
}

fun Map<Value, Value>.get(key: String): Value? {
     return this[ValueFactory.newString(key)]
}

fun Map<Value, Value>.getValue(key: String): Value {
    return getValue(ValueFactory.newString(key))
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

fun mapFeatureCategories(msgObject: Value): List<FeatureCategory> {
    return msgObject.asArrayValue().map {
        mapFeatureCategory(it)
    }
}

fun mapFeatureCategory(msgObject: Value): FeatureCategory {
    val map = msgObject.asMapValue().map()

    return FeatureCategory(
        FeatureCategoryId.valueOf(map.getValue("id").toString()),
        name = map.getValue("name").toString(),
        features = mapFeatures(map.getValue("features"))
    )
}

fun mapFeatures(msgObject: Value): List<Feature> {
    return msgObject.asArrayValue().map {
        mapFeature(it)
    }
}

fun mapFeature(msgObject: Value): Feature {
    val map = msgObject.asMapValue().map()

    return Feature(
        map.getValue("path").toString(),
        id = map.getValue("id").toString(),
        name = map.getValue("name").toString(),
        author = map.get("author")?.toString(),
        version = map.get("version")?.toString(),
        description = map.get("description")?.toString(),
        thumbnail = map.get("thumbnail")?.toString(),
        thumbnailColor = Color.parseColor(
            map.getValue("thumbnailColor").toString()
        ),
        primaryColor = Color.parseColor(
            map.getValue("primaryColor").toString()
        ),
        borderColor = Color.parseColor(
            map.getValue("borderColor").toString()
        ),
        tileTextColor = Color.parseColor(
            map.getValue("tileTextColor").toString()
        ),
        links = map.getValue("links").asMapValue().map().map {
            it.key.asStringValue().asString() to
                it.value.asStringValue().asString()
        }.toMap()
    )
}
