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
    msgObject.asArrayValue().map {
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
        thumbnailColor = map.getValue("thumbnailColor").toString(),
        primaryColor = map.getValue("primaryColor").toString(),
        borderColor = map.getValue("borderColor").toString(),
        tileTextColor = map.getValue("tileTextColor").toString(),
        links = map.getValue("links").getMapValue().map {
            it.key.asStringValue().asString() to
                it.value.asStringValue().asString()
        }.toMap()
    )
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
