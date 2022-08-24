package coop.polypoly.polypod
import android.content.Context
import coop.polypoly.polypod.endpoint.Endpoint
import coop.polypoly.polypod.logging.LoggerFactory

object ErrorUploader {
    private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)

    suspend fun uploadToServer(context: Context, errorMsg: String) {
        val endpointId = "polyApiErrorReport"
        val endpoint = Endpoint(context)

        val endpointInfo = endpoint.endpointInfofromId(endpointId)
        if (endpointInfo == null) {
            logger.error(
                "uploadToServer: No endpoint found under that endpointId"
            )
            throw PodApiError().endpointError()
        }

        try {
            endpoint.send(
                endpointId,
                errorMsg,
                "application/json",
                endpointInfo.auth
            )
            logger.debug("uploadToServer() - endpoint.post")
        } catch (e: PodApiError) {
            logger.error("uploadToServer - Failed: $e")
        }
    }
}
