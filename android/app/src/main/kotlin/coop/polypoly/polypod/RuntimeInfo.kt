package coop.polypoly.polypod

class RuntimeInfo {
    companion object {
        const val NAME: String = "polyPod for Android"
        const val VERSION: String =
            "${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})"
    }
}
