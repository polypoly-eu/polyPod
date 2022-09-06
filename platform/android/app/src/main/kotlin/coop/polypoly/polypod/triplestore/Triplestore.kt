package coop.polypoly.polypod.triplestore

import coop.polypoly.core.Core
import org.msgpack.value.Value

open class Triplestore() {
    open fun query(query: String): Value {
        return Core.execRdfQuery(query)
    }

    open fun update(query: String) {
        return Core.execRdfUpdate(query)
    }
}
