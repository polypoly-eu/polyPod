package coop.polypoly.polypod.polyNav

import coop.polypoly.polypod.features.Feature

class PolyNavObserver(
    val onActionsChanged: ((List<String>) -> Unit)? = null,
    val onTitleChanged: ((String) -> Unit)? = null,
    val onOpenUrl: ((String) -> Unit)? = null
) {
}
