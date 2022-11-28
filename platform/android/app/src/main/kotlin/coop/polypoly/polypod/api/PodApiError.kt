package coop.polypoly.polypod.api

class PodApiError(message: String = "") : Exception(message) {
    fun endpointError() = PodApiError("unable to contact endpoint")
    fun userDeniedPermission() =
        PodApiError("user denied request to endpoint")
}
