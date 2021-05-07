package coop.polypoly.polypod.polyNav

import coop.polypoly.polypod.features.Feature

class PolyNavObserver(
    var feature : Feature,
    val onActionsChanged: ((List<String>) -> Unit)? = null,
    val onTitleChanged: ((String) -> Unit)? = null
) {
}
