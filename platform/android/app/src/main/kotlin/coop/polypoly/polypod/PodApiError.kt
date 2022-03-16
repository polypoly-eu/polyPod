package coop.polypoly.polypod


interface PodApiErrorInterface {
    fun endpointError(fetchType:String): Exception
}
val PodApiError = object : PodApiErrorInterface {
    override fun endpointError(fetchType:String): Exception {
        return Exception("endpoint.$fetchType failed")
    }
}


