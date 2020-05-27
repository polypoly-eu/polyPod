package eu.polypoly.pod.android

import eu.polypoly.bubblewrap.Codec
import org.msgpack.value.Value
import java.lang.IllegalArgumentException

private const val TAG = "PodApi"

class PodApi {

    private fun decodeCall(value: Value): Pair<String, List<Value>> {
        val map = value.asMapValue().keyValueArray
        return Pair(
            map[1].asStringValue().toString(),
            map[3].asArrayValue().list()
        )
    }

    fun dispatch(value: List<Value>): Value {
        val (outer, _) = decodeCall(value[0])
        if (outer.equals("polyOut")) {
            val (inner, args) = decodeCall(value[1])
            if (inner.equals("fetch")) {
                val result = fetch(args[0].asStringValue().toString())
                val codec =
                    Codec.kvArray(Codec.string, Codec.string).taggedClass("@polypoly-eu/podigree.FetchResponse")
                return codec.encode(mapOf(Pair("bufferedText", result)))
            }
        }

        throw IllegalArgumentException()
    }

    fun fetch(uri: String): String {
        return "you fetched $uri"
    }

}
