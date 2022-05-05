package coop.polypoly.polypod

import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.synnapps.carouselview.CarouselView

class OnboardingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
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
            if (Authentication.shouldShowBiometricsPrompt(this)) {
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
            val position = requestedPosition

            val slide = layoutInflater.inflate(R.layout.onboarding_slide, null)
            strings[position].forEach { (viewId, stringId) ->
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
                    Authentication.setUp(this, newStatus = true) { _ ->
                        true
                    }
                }
                val doNotAskButton = slide.findViewById<View>(
                    R.id.onboarding_button_do_not_ask
                )
                doNotAskButton.visibility = View.VISIBLE
                doNotAskButton.setOnClickListener {
                    Preferences.setBiometricCheck(this, false)
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
                        carousel.setCurrentItem(carousel.currentItem + 1)
                    }
                }
            }
            slide
        }
    }

    private fun close() {
        if (Preferences.isFirstRun(baseContext)) {
            Preferences.setFirstRun(baseContext, false)
        }
        finish()
    }
}
