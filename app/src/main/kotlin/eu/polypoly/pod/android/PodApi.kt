package eu.polypoly.pod.android

import eu.polypoly.bubblewrap.Codec
import eu.polypoly.pod.android.polyOut.FetchInit
import eu.polypoly.pod.android.polyOut.PolyOut
import org.msgpack.value.Value

// sufficient for now to have just a singleton, later on there should be one PodApi object per Feature
object PodApi {
    private fun decodeCall(value: Value): Pair<String, List<Value>> {
        val map = value.asMapValue().keyValueArray
        return Pair(
            map[1].asStringValue().toString(),
            map[3].asArrayValue().list()
        )
    }

    suspend fun dispatch(value: List<Value>): Value {
        val (outer, _) = decodeCall(value[0])
        val (inner, args) = decodeCall(value[1])
        if (outer == "polyOut") {
            if (inner == "fetch") {
                val result = PolyOut.fetch(args[0].asStringValue().toString(), FetchInit())
                val codec =
                    Codec.kvArray(Codec.string, Codec.string).taggedClass("@polypoly-eu/podigree.FetchResponse")
                return codec.encode(mapOf(Pair("bufferedText", result.bodyContent)))
            }
        }

        throw IllegalArgumentException("Unable to handle request, unsupported call target: '${outer}.${inner}()'")
    }
}
