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
        setContentView(R.layout.activity_onboarding)

        val closeButton = findViewById<ImageButton>(R.id.close_button)
        closeButton.setOnClickListener {
            close()
        }
        val carousel = findViewById<CarouselView>(R.id.carousel)
        val strings = listOf(
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

        carousel.pageCount = strings.size
        carousel.setViewListener { position ->
            val slide = layoutInflater.inflate(R.layout.onboarding_slide, null)
            strings[position].forEach { (viewId, stringId) ->
                slide.findViewById<TextView>(viewId).text = getString(stringId)
            }
            if (position == strings.size - 1) {
                val button = slide.findViewById<View>(
                    R.id.end_onboarding_button
                )
                button.visibility = View.VISIBLE
                button.setOnClickListener {
                    close()
                }
            }
            slide
        }
    }

    private fun close() {
        if (Preferences.isFirstRun(baseContext))
            Preferences.setFirstRun(baseContext, false)
        finish()
    }
}
