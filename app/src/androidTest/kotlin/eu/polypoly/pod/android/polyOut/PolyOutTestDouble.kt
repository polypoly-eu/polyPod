package eu.polypoly.pod.android.polyOut

class PolyOutTestDouble : PolyOut() {
    var fetchWasCalled = false
    var fetchInit: FetchInit = FetchInit()
    var responseBody: String? = null
    var responseStatus: Int? = null
    var responseOk = false

    override suspend fun fetch(resource: String, init: FetchInit): FetchResponse {
        fetchWasCalled = true
        fetchInit = init
        val response = FetchResponse()
        response.status = responseStatus
        response.bodyContent = responseBody
        response.ok = responseOk
        return response
    }

    fun returnBody(body: String) {
        responseBody = body
    }

    fun returnStatus(status: Int) {
        responseStatus = status
    }

    fun returnOk(ok: Boolean) {
        responseOk = ok
    }
}
