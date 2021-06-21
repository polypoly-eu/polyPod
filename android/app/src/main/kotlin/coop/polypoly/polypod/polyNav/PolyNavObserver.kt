package coop.polypoly.polypod.polyNav

class PolyNavObserver(
    val onActionsChanged: ((List<String>) -> Unit)? = null,
    val onTitleChanged: ((String) -> Unit)? = null,
    val onOpenUrl: ((String) -> Unit)? = null
)
