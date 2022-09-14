package coop.polypoly.polypod

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.TextView
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.synnapps.carouselview.CarouselView
import coop.polypoly.polypod.oauth.OAuth
import net.openid.appauth.AuthorizationException
import net.openid.appauth.AuthorizationResponse
import net.openid.appauth.AuthorizationService
import net.openid.appauth.AuthorizationService.TokenResponseCallback


class OnboardingActivity : AppCompatActivity() {
    lateinit var startForResult: ActivityResultLauncher<Intent>
    lateinit var authService: AuthorizationService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        authService = AuthorizationService(this)

        startForResult = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
            if (it.resultCode == Activity.RESULT_OK) {
                val data: Intent = it.data!!
                val resp = AuthorizationResponse.fromIntent(data)
                val ex = AuthorizationException.fromIntent(data)

                authService.performTokenRequest(
                    resp!!.createTokenExchangeRequest(),
                    TokenResponseCallback { resp, ex ->
                        if (resp != null) {
                            println("Received token")
                            // exchange succeeded
                        } else {
                            // authorization failed, check ex for more details
                        }
                    })
                // There are no request codes
            }
        }

        var isInfo = false
        if (this.intent?.data?.toString() == "info") {
            isInfo = true
        }
        setContentView(R.layout.activity_onboarding)

        val closeButton = findViewById<ImageButton>(R.id.close_button)
        closeButton.setOnClickListener {
            close()
        }
        val carousel = findViewById<CarouselView>(R.id.carousel)
        var strings = mutableListOf(
            mapOf(
                R.id.headline_main to R.string.onboarding_slide1_headline,
                R.id.headline_sub to R.string.onboarding_slide1_sub_headline,
                R.id.body_text to R.string.onboarding_slide1_body_text,
            ),
            mapOf(
                R.id.headline_main to R.string.onboarding_slide2_headline,
                R.id.headline_sub to R.string.onboarding_slide2_sub_headline,
                R.id.body_text to R.string.onboarding_slide2_body_text,
            ),
            mapOf(
                R.id.headline_main to R.string.onboarding_slide3_headline,
                R.id.headline_sub to R.string.onboarding_slide3_sub_headline,
                R.id.body_text to R.string.onboarding_slide3_body_text,
            ),
        )

        if (!isInfo) {
            if (Authentication.shouldShowAuthOnboarding(this)) {
                strings = strings.plus(
                    mapOf(
                        R.id.headline_main to
                            R.string.onboarding_slide4_headline,
                        R.id.headline_sub to
                            R.string.onboarding_slide4_sub_headline,
                        R.id.body_text to R.string.onboarding_slide4_body_text,
                    )
                ).toMutableList()
            }

            if (!Preferences.isFirstRun(baseContext)) {
                strings = mutableListOf(strings[3])
            }
        }

        carousel.pageCount = strings.size
        carousel.setViewListener { requestedPosition ->

            val slide = layoutInflater.inflate(R.layout.onboarding_slide, null)
            strings[requestedPosition].forEach { (viewId, stringId) ->
                slide.findViewById<TextView>(viewId).text = getString(stringId)
            }
            if (slide.findViewById<TextView>(R.id.headline_main).text ==
                getString(R.string.onboarding_slide4_headline)
            ) {
                val button = slide.findViewById<View>(
                    R.id.onboarding_button_auth
                )
                button.visibility = View.VISIBLE
                button.setOnClickListener {
                    Authentication.setUp(
                        this,
                        showAuthTexts = false,
                        newBiometricState = true
                    ) {
                        close()
                    }
                }
                val doNotAskButton = slide.findViewById<View>(
                    R.id.onboarding_button_do_not_ask
                )
                doNotAskButton.visibility = View.VISIBLE
                doNotAskButton.setOnClickListener {
                    Preferences.setSecurityDoNotAskAgainCheck(this, true)
                    close()
                }
            }
            if (slide.findViewById<TextView>(R.id.headline_main).text ==
                getString(R.string.onboarding_slide3_headline)
            ) {
                val button = slide.findViewById<View>(
                    R.id.end_onboarding_button
                )
                button.visibility = View.VISIBLE
                button.setOnClickListener {
                    if (carousel.currentItem == (carousel.pageCount - 1)) {
                        close()
                    } else {
                        carousel.currentItem = carousel.currentItem + 1
                    }
                }
            }
            slide
        }
    }

    private fun close() {
        val request = OAuth.startAuth()
        val authIntent: Intent =
            authService.getAuthorizationRequestIntent(request)
        startForResult.launch(authIntent)

//        if (Preferences.isFirstRun(baseContext)) {
//            Preferences.setFirstRun(baseContext, false)
//        }
//        finish()
    }
}
