package coop.polypoly.polypod

class PodApiError(message: String = "") : Exception(message) {
    fun endpointError() = PodApiError("unable to contact endpoint")
    fun endpointPermissionDenied() =
        PodApiError("user denied request to endpoint")
}
