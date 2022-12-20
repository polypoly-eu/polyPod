package coop.polypoly.polypod.api.triplestore

import coop.polypoly.core.Core
import coop.polypoly.core.CoreRequest
import org.msgpack.value.Value

open class Triplestore() {
    open fun query(query: String): Value {
        return Core.executeRequest(CoreRequest.ExecuteRdfQuery(query)) { it }
    }

    open fun update(query: String) {
        return Core.executeRequest(CoreRequest.ExecuteRdfUpdate(query))
    }
}
