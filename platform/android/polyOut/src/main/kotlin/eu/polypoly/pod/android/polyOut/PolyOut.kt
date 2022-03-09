package eu.polypoly.pod.android.polyOut

import eu.polypoly.fetch.OkFetch
import eu.polypoly.fetch.RequestInit
import kotlinx.coroutines.future.await

open class PolyOut {
    private val client = OkFetch()

    open suspend fun fetch(resource: String, init: FetchInit): FetchResponse {
        val result = client.fetch(
            resource,
            RequestInit(init.body, init.headers, init.method)
        ).await()
        val response = FetchResponse()
        response.ok = result.ok()
        response.status = result.status()
        response.bodyContent = result.text().await()
        return response
    }
}
