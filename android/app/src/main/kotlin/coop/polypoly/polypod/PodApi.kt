package coop.polypoly.polypod

import coop.polypoly.polypod.bubblewrap.FetchResponseCodec
import coop.polypoly.polypod.info.Info
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.network.Network
import coop.polypoly.polypod.polyIn.PolyIn
import coop.polypoly.polypod.polyIn.rdf.Matcher
import coop.polypoly.polypod.polyIn.rdf.Quad
import coop.polypoly.polypod.polyNav.PolyNav
import coop.polypoly.polypod.polyOut.PolyOut
import eu.polypoly.pod.android.polyOut.FetchInit
import org.msgpack.value.MapValue
import org.msgpack.value.StringValue
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

open class PodApi(
    open val polyOut: PolyOut,
    open val polyIn: PolyIn,
    open val polyNav: PolyNav,
    open val info: Info,
    open val network: Network
) {

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
                    "readFile" -> return handlePolyOutReadFile(args)
                    "writeFile" -> return handlePolyOutWriteFile(args)
                    "stat" -> return handlePolyOutStat(args)
                    "readdir" -> return handlePolyOutReadDir(args)
                    "importArchive" -> return handlePolyOutImportArchive(args)
                    "removeArchive" -> return handlePolyOutRemoveArchive(args)
                }
            }
            "polyIn" -> {
                when (inner) {
                    "add" -> return handlePolyInAdd(args)
                    "select" -> return handlePolyInSelect(args)
                    "match" -> return handlePolyInSelect(args)
                    "delete" -> return handlePolyInDelete(args)
                    "has" -> return handlePolyInHas(args)
                }
            }
            "polyNav" -> {
                when (inner) {
                    "setActiveActions" ->
                        return handlePolyNavSetActiveActions(args)
                    "setTitle" -> return handlePolyNavSetTitle(args)
                    "openUrl" -> return handlePolyNavOpenUrl(args)
                    "pickFile" -> return handlePolyNavPickFile(args)
                }
            }
            "info" -> {
                when (inner) {
                    "getRuntime" -> return handleInfoGetRuntime()
                    "getVersion" -> return handleInfoGetVersion()
                }
            }
            "network" -> {
                when (inner) {
                    "httpPost" -> return handleNetworkHttpPost(args)
                }
            }
        }
        throw IllegalArgumentException(
            """
                Unable to handle request,
                unsupported call target: '$outer.$inner()'
            """
        )
    }

    private suspend fun handlePolyOutFetch(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.fetch")
        throw Exception("Not implemented")
        return ValueFactory.newNil()
    }

    private suspend fun handlePolyOutReadFile(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.readFile")
        val result = polyOut.readFile(args[0].asStringValue().toString())
        return ValueFactory.newBinary(result)
    }

    private suspend fun handlePolyOutWriteFile(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.readFile")
        val result = polyOut.writeFile(
            args[0].asStringValue().toString(),
            args[1].asBinaryValue().asByteBuffer()
        )
        return ValueFactory.newBoolean(true)
    }

    private suspend fun handlePolyOutStat(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.stat")
        var resultEncoded = mutableMapOf<Value, Value>()

        polyOut.stat(args[0].asStringValue().toString()).forEach {
            resultEncoded.put(
                ValueFactory.newString(it.key),
                ValueFactory.newString(it.value)
            )
        }

        return ValueFactory.newMap(
            resultEncoded
        )
    }

    private suspend fun handlePolyOutReadDir(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.readdir")
        var path = ""
        if (!args[0].isNilValue) { path = args[0].asStringValue().toString() }
        val result = polyOut.readdir(path)
        return ValueFactory.newArray(result.map { ValueFactory.newString(it) })
    }

    private suspend fun handlePolyOutImportArchive(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.importArchive")
        val url = args[0].asStringValue().toString()
        polyOut.importArchive(url)?.let {
            return ValueFactory.newString(it.path.toString())
        }
        return ValueFactory.newNil()
    }

    private suspend fun handlePolyOutRemoveArchive(args: List<Value>): Value {
        logger.debug("dispatch() -> polyOut.removeArchive")
        val fileId = args[0].asStringValue().toString()
        polyOut.removeArchive(fileId)
        return ValueFactory.newNil()
    }

    private suspend fun handlePolyInAdd(args: List<Value>): Value {
        logger.debug("dispatch() -> polyIn.add")
        val quads = args.map { Quad.codec.decode(it) }
        polyIn.add(quads)
        return ValueFactory.newNil() // add() doesn't return anything
    }

    private suspend fun handlePolyInSelect(args: List<Value>): Value {
        logger.debug("dispatch() -> polyIn.select")
        val result = polyIn.select(Matcher.codec.decode(args[0]))
        return ValueFactory.newArray(result.map { Quad.codec.encode(it) })
    }

    private suspend fun handlePolyInDelete(args: List<Value>): Value {
        logger.debug("dispatch() -> polyIn.delete")
        val quads = args.map { Quad.codec.decode(it) }
        polyIn.delete(quads)
        return ValueFactory.newNil()
    }

    private suspend fun handlePolyInHas(args: List<Value>): Value {
        logger.debug("dispatch() -> polyIn.has")
        val quads = args.map { Quad.codec.decode(it) }
        if (polyIn.has(quads))
            return ValueFactory.newBoolean(true)
        else
            return ValueFactory.newBoolean(false)
    }

    private fun handlePolyNavOpenUrl(args: List<Value>): Value {
        logger.debug("dispatch() -> polyNav.openUrl")
        polyNav.openUrl(args[0].asStringValue().toString())
        return ValueFactory.newNil()
    }

    private fun handlePolyNavSetTitle(args: List<Value>): Value {
        logger.debug("dispatch() -> polyNav.setTitle")
        polyNav.setTitle((args[0].asStringValue().toString()))
        return ValueFactory.newNil()
    }

    private fun handlePolyNavSetActiveActions(args: List<Value>): Value {
        logger.debug("dispatch() -> polyNav.setActiveActions")
        val argsList = args[0].asArrayValue().map {
            it.asStringValue().toString()
        }
        polyNav.setActiveActions(argsList.toTypedArray())
        return ValueFactory.newNil()
    }

    private suspend fun handlePolyNavPickFile(args: List<Value>): Value {
        val type = args[0].let {
            if (it.isStringValue) it.asStringValue().toString() else null
        }
        logger.debug("dispatch() -> polyNav.pickFile")
        polyNav.pickFile(type)?.let {
            return ValueFactory.newString(it.toString())
        }
        return ValueFactory.newNil()
    }

    private fun handleInfoGetRuntime(): Value {
        logger.debug("dispatch() -> info.getRuntime")
        return ValueFactory.newString(info.getRuntime())
    }

    private fun handleInfoGetVersion(): Value {
        logger.debug("dispatch() -> info.getVersion")
        return ValueFactory.newString(info.getVersion())
    }

    private suspend fun handleNetworkHttpPost(args: List<Value>): Value {
        logger.debug("dispatch() -> network.httpPost")
        val url = args[0].asStringValue().toString()
        val contentType = args[1].asStringValue().toString()
        val body = args[2].asStringValue().toString()
        val authorization: String? = args[3]?.asStringValue().toString()
        val error = network.httpPost(url, contentType, body, authorization)
        return if (error == null) ValueFactory.newNil()
        else ValueFactory.newString(error)
    }

    private fun decodePolyOutFetchCallArgs(args: Value): FetchInit {
        logger.debug(
            "decodePolyOutFetchCallArgs(), args: '{}', args.type: '{}'",
            args,
            args.valueType
        )
        val argsMap = (args as MapValue).map()
        val fetchInit = FetchInit()
        for (key in argsMap.keys) {
            logger.debug(
                "Args contain, key[{}]: '{}', value[{}]: '{}'",
                key.valueType,
                key,
                argsMap[key]!!.valueType,
                argsMap[key]
            )
            when ((key as StringValue).toString()) {
                "method" -> {
                    // this has to be String
                    fetchInit.method = argsMap[key]!!.toString()
                }
                "headers" -> {
                    val headers = HashMap<String, String>()
                    val value = argsMap[key]!! as MapValue
                    value.entrySet()
                        .map { (k, v) ->
                            Pair(
                                (k as StringValue).toString(),
                                (v as StringValue).toString()
                            )
                        }
                        .forEach { (k, v) -> headers[k] = v }
                    fetchInit.headers = headers
                }
                "body" -> {
                    // this has to be a String
                    fetchInit.body = argsMap[key]!!.toString()
                }
            }
        }
        return fetchInit
    }
}
