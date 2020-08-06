package eu.polypoly.pod.android.polyOut

import eu.polypoly.fetch.OkFetch
import eu.polypoly.fetch.RequestInit
import kotlinx.coroutines.future.await
import okhttp3.OkHttpClient

// TODO - convert to a class and create an instance per Feature
object PolyOut {
    private val client = OkFetch(OkHttpClient())

    suspend fun fetch(resource: String, init: FetchInit): FetchResponse {
        val result = client.fetch(resource, RequestInit(null, init.headers, init.method)).await()
        val response = FetchResponse()
        response.ok = result.ok()
        response.status = result.status()
        response.bodyContent = result.text().await()
        return response
    }
}
