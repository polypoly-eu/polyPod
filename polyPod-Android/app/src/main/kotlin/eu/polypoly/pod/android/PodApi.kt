package eu.polypoly.pod.android

import eu.polypoly.pod.android.bubblewrap.FetchResponseCodec
import eu.polypoly.pod.android.logging.LoggerFactory
import eu.polypoly.pod.android.polyIn.PolyIn
import eu.polypoly.pod.android.polyIn.rdf.Matcher
import eu.polypoly.pod.android.polyIn.rdf.Quad
import eu.polypoly.pod.android.polyOut.FetchInit
import eu.polypoly.pod.android.polyOut.PolyOut
import org.msgpack.value.MapValue
import org.msgpack.value.StringValue
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

open class PodApi(open val polyOut: PolyOut, open val polyIn: PolyIn) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val fetchResponseCodec = FetchResponseCodec()

    private fun decodeCall(value: Value): Pair<String, List<Value>> {
        val map = value.asMapValue().keyValueArray
        return Pair(
            map[1].asStringValue().toString(),
            map[3].asArrayValue().list()
        )
    }

    suspend fun dispatch(value: List<Value>): Value {
        logger.debug("dispatch(), value: '{}'", value.toString())
        val (outer, _) = decodeCall(value[0])
        val (inner, args) = decodeCall(value[1])
        when (outer) {
            "polyOut" -> {
                when (inner) {
                    "fetch" -> return handlePolyOutFetch(args)
                }
            }
            "polyIn" -> {
                when (inner) {
                    "add" -> return handlePolyInAdd(args)
                    "select" -> return handlePolyInSelect(args)
                }
            }
        }
        throw IllegalArgumentException("Unable to handle request, unsupported call target: '${outer}.${inner}()'")
    }

    private suspend fun handlePolyOutFetch(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.fetch")
        val result = polyOut.fetch(args[0].asStringValue().toString(), decodePolyOutFetchCallArgs(args[1]))
        return fetchResponseCodec.encode(result)
    }

    private suspend fun handlePolyInAdd(args: List<Value>): Value {
        logger.debug("dispatch() -> polyIn.add")
        val quads = args.map { Quad.codec.decode(it) }
        polyIn.add(quads)
        return ValueFactory.newNil()  // add() doesn't return anything
    }

    private suspend fun handlePolyInSelect(args: List<Value>): Value {
        logger.debug("dispatch() -> polyIn.select")
        val result = polyIn.select(Matcher.codec.decode(args[0]))
        return ValueFactory.newArray(result.map { Quad.codec.encode(it) })
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
