package coop.polypoly.polypod.polyNav

import coop.polypoly.polypod.ExternalFile

class PolyNavObserver(
    val onActionsChanged: ((List<String>) -> Unit)? = null,
    val onTitleChanged: ((String) -> Unit)? = null,
    val onOpenUrl: ((String) -> Unit)? = null,
    val onPickFile: (suspend (String?) -> ExternalFile?)? = null
)
