package coop.polypoly.polypod.polyOut

import android.content.Context
import eu.polypoly.pod.android.polyOut.FetchInit
import eu.polypoly.pod.android.polyOut.FetchResponse

class PolyOutTestDouble(context: Context) : PolyOut(context) {
    var fetchWasCalled: Boolean = false
    var fetchInit: FetchInit = FetchInit()
    var responseBody: String? = null
    var responseStatus: Int? = null
    var responseOk = false

    fun reset() {
        fetchWasCalled = false
        fetchInit = FetchInit()
        responseBody = null
        responseStatus = null
        responseOk = false
    }

    suspend fun fetch(
        resource: String,
        init: FetchInit
    ): FetchResponse {
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
