package coop.polypoly.polypod

import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity

class PodUnlockActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pod_unlock)

        val button = findViewById<View>(
            R.id.unlock_button
        )

        button.setOnClickListener {
            authenticate()
        }

        authenticate()
    }

    private fun authenticate() {
        Authentication.authenticate(this, showAuthTexts = true) {
            if (it) {
                finish()
            }
        }
    }
}
