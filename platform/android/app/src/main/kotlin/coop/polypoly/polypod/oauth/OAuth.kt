package coop.polypoly.polypod.oauth

import android.net.Uri
import net.openid.appauth.*

class OAuth {
    companion object {
        fun startAuth() : AuthorizationRequest {
            val tokenEndpoint =
                Uri.parse("https://keycloak.stage.polypoly.tech/realms/le-test/protocol/openid-connect/token")
            val authEndpoint =
                Uri.parse("https://keycloak.stage.polypoly.tech/realms/le-test/protocol/openid-connect/auth")
            val clientId = "pmf"
            val redirectUri = Uri.parse("coop.polypoly.polypod://oauth/redirect")
            val responseType = ResponseTypeValues.CODE
            val config =
                AuthorizationServiceConfiguration(authEndpoint, tokenEndpoint)

            val requestBuilder = AuthorizationRequest.Builder(
                config,
                clientId,
                responseType,
                redirectUri
            )

             return requestBuilder.setScope("email openid").build()
        }
    }
}
