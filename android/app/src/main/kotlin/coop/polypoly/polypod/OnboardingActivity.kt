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
            finish()
        }

        val carousel = findViewById<CarouselView>(R.id.carousel)
        // TODO: Don't hard code these strings
        val strings = listOf(
            mapOf(
                "headlineMain" to "Hallo, darf ich\nmich vorstellen?",
                "headlineSub" to "Ich bin Ihr\npolyPod.",
                "bodyText" to "In Zukunft möchte ich gerne dafür sorgen, dass Privates privat bleibt. Das klappt natürlich nicht sofort, aber Schritt für Schritt schaffen wir das gemeinsam."
            ),
            mapOf(
                "headlineMain" to "Im ersten Schritt\nerkunden wir",
                "headlineSub" to "gemeinsam den\nFluss der Daten.",
                "bodyText" to "Um etwas zu verändern, müssen wir uns bewusst werden, was genau mit unseren Daten passiert. Lassen Sie uns gemeinsam herausfinden, wie Unternehmen mit Ihren Daten umgehen."
            ),
            mapOf(
                "headlineMain" to "Ein erster Schritt\ndem viele folgen.",
                "headlineSub" to "Damit Privates\nprivat bleibt.",
                "bodyText" to "Nach und nach biete ich Ihnen immer mehr Möglichkeiten, Ihre Privatsphäre zu schützen. Ich melde mich natürlich, sobald eine neue Funktion für Sie bereit steht."
            ))

        carousel.pageCount = strings.size
        carousel.setViewListener { position ->
            val slide = layoutInflater.inflate(R.layout.onboarding_slide, null)
            mapOf(
                "headlineMain" to R.id.headline_main,
                "headlineSub" to R.id.headline_sub,
                "bodyText" to R.id.body_text
            ).forEach { (key, viewId) ->
                slide.findViewById<TextView>(viewId).text = strings[position][key]
            }
            if (position == strings.size - 1) {
                val button = slide.findViewById<View>(R.id.end_onboarding_button)
                button.visibility = View.VISIBLE
                button.setOnClickListener {
                    finish()
                }
            }
            slide
        }
    }
}
