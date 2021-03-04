package coop.polypoly.polypod

import android.os.Bundle
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
        val strings = listOf("Here be onboarding!", "Here be more onboarding!")
        carousel.pageCount = strings.size
        carousel.setViewListener { position ->
            val helloText = TextView(applicationContext)
            helloText.text = strings[position]
            helloText
        }
    }
}
