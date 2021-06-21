package coop.polypoly.polypod.bubblewrap

import eu.polypoly.bubblewrap.Codec
import eu.polypoly.pod.android.polyOut.FetchResponse
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

class FetchResponseCodec : Codec<FetchResponse> {
    override fun encode(result: FetchResponse): Value {
        val codec = Codec.kvArray(Codec.string, Codec.id).taggedClass(
            "@polypoly-eu/remote-pod.FetchResponse"
        )
        val response = HashMap<String, Value>()
        if (result.bodyContent != null)
            response["bufferedText"] = Codec.string.encode(result.bodyContent!!)
        if (result.status != null)
            response["status"] =
                ValueFactory.newInteger(result.status!!.toLong())
        if (result.ok != null)
            response["ok"] = ValueFactory.newBoolean(result.ok!!)
        return codec.encode(response)
    }

    override fun decode(p0: Value?): FetchResponse {
        TODO("Not yet implemented")
    }
}
