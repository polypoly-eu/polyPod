package eu.polypoly.pod.android

import eu.polypoly.pod.android.bubblewrap.FetchResponseCodec
import eu.polypoly.pod.android.logging.LoggerFactory
import eu.polypoly.pod.android.polyOut.FetchInit
import eu.polypoly.pod.android.polyOut.PolyOut
import org.msgpack.value.MapValue
import org.msgpack.value.StringValue
import org.msgpack.value.Value

open class PodApi(val polyOut: PolyOut) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }
    private fun decodeCall(value: Value): Pair<String, List<Value>> {
        val map = value.asMapValue().keyValueArray
        return Pair(
            map[1].asStringValue().toString(),
            map[3].asArrayValue().list()
        )
    }

    suspend fun dispatch(value: List<Value>): Value {
        logger.debug("dispatch(), value: '{}'", value.toString());
        val (outer, _) = decodeCall(value[0])
        val (inner, args) = decodeCall(value[1])
        if (outer == "polyOut") {
            if (inner == "fetch") {
                logger.debug("dispatch() -> polyOut.fetch");
                val result = polyOut.fetch(args[0].asStringValue().toString(), decodePolyOutFetchCallArgs(args[1]))
                val codec = FetchResponseCodec()
                return codec.encode(result)
            }
        }

        throw IllegalArgumentException("Unable to handle request, unsupported call target: '${outer}.${inner}()'")
    }

    private fun decodePolyOutFetchCallArgs(args: Value): FetchInit {
        logger.debug("decodePolyOutFetchCallArgs(), args: '{}', args.type: '{}'", args, args.valueType)
        val argsMap = (args as MapValue).map()
        val fetchInit = FetchInit()
        for (key in argsMap.keys) {
            logger.debug("Args contain, key[{}]: '{}', value[{}]: '{}'", key.valueType, key, argsMap[key]!!.valueType, argsMap[key])
            when ((key as StringValue).toString()) {
                "method" -> {
                    fetchInit.method = argsMap[key]!!.toString()  // this has to be String
                }
                "headers" -> {
                    val headers = HashMap<String, String>()
                    val value = argsMap[key]!! as MapValue
                    value.entrySet()
                        .map { (k, v) -> Pair((k as StringValue).toString(), (v as StringValue).toString()) }
                        .forEach { (k, v) -> headers[k] = v }
                    fetchInit.headers = headers
                }
                "body" -> {
                    fetchInit.body = argsMap[key]!!.toString()  // this has to be a String
                }
            }
        }
        return fetchInit
    }
}
