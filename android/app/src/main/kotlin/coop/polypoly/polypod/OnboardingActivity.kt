package coop.polypoly.polypod

import android.app.AlertDialog
import android.app.admin.DevicePolicyManager
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import com.synnapps.carouselview.CarouselView

class OnboardingActivity : AppCompatActivity() {
    companion object {
        val desiredLockScreenType =
            BiometricManager.Authenticators.BIOMETRIC_WEAK or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL
    }

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

        if (shouldShowBiometricsPrompt()) {
            strings = strings.plus(
                mapOf(
                    R.id.headline_main to R.string.onboarding_slide4_headline,
                    R.id.headline_sub to
                        R.string.onboarding_slide4_sub_headline,
                    R.id.body_text to R.string.onboarding_slide4_body_text,
                )
            ).toMutableList()
        }

        if (!Preferences.isFirstRun(baseContext) && !isInfo) {
            if (!shouldShowBiometricsPrompt()) {
                close()
                return
            }
            strings = mutableListOf(strings[3])
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
                    Preferences.setBiometricEnabled(this, true)
                    close()
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

    fun shouldShowBiometricsPrompt(): Boolean {
        return biometricsAvailable() &&
            Preferences.getBiometricCheck(this) &&
            !Preferences.getBiometricEnabled(this)
    }
    fun biometricsAvailable(): Boolean {
        val biometricManager = BiometricManager.from(this)
        if (biometricManager.canAuthenticate(
                desiredLockScreenType
            ) != BiometricManager.BIOMETRIC_SUCCESS
        ) {
            return false
        }
        return true
    }

    fun ensureLockScreen(
        noScreenLock: (() -> Unit),
        authAvailable: (() -> Unit)
    ) {
        if (!Preferences.getBiometricCheck(this)) {
            return noScreenLock()
        }
        if (biometricsAvailable()) {
            return authAvailable()
        }

        AlertDialog.Builder(this)
            .setTitle(R.string.auth_enable_lock_title)
            .setMessage(R.string.auth_enable_lock_message)
            .setPositiveButton(R.string.auth_enable_lock_yes) { dialog, _ ->
                run {
                    dialog.dismiss()
                    startActivity(
                        Intent(DevicePolicyManager.ACTION_SET_NEW_PASSWORD)
                    )
                }
            }
            .setNegativeButton(R.string.auth_enable_lock_no) { dialog, _ ->
                run {
                    noScreenLock()
                    dialog.dismiss()
                }
            }
            .setOnCancelListener { this.finish() }
            .show()
    }
}
