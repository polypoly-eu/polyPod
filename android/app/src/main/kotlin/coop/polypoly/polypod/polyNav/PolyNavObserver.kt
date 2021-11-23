package coop.polypoly.polypod.polyNav

import org.msgpack.value.Value

class PolyNavObserver(
    val onActionsChanged: ((List<String>) -> Unit)? = null,
    val onTitleChanged: ((String) -> Unit)? = null,
    val onOpenUrl: ((String) -> Unit)? = null,
    val onPickFile: (suspend (String?) -> MutableMap<Value, Value>?)? = null
)
