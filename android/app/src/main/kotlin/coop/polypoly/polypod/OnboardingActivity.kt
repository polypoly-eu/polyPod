package coop.polypoly.polypod

import android.app.AlertDialog
import android.app.admin.DevicePolicyManager
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.CheckBox
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.core.view.size
import com.synnapps.carouselview.CarouselView

class OnboardingActivity : AppCompatActivity() {
    companion object {
        val desiredLockScreenType =
            BiometricManager.Authenticators.BIOMETRIC_WEAK or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
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
                R.id.headline_main to R.string.onboarding_slide4_headline,
                R.id.headline_sub to R.string.onboarding_slide4_sub_headline,
                R.id.body_text to R.string.onboarding_slide4_body_text,
            ),
        )

        if (shouldShowBiometricsPrompt()) {
            strings.add(
                2,
                mapOf(
                    R.id.headline_main to R.string.onboarding_slide3_headline,
                    R.id.headline_sub to
                        R.string.onboarding_slide3_sub_headline,
                    R.id.body_text to R.string.onboarding_slide3_body_text,
                )
            )
        }

        if (!Preferences.isFirstRun(baseContext)) {
            if (!shouldShowBiometricsPrompt()) {
                close()
                return
            }
            strings = mutableListOf(strings[2])
        }

        carousel.pageCount = strings.size
        carousel.setViewListener { requestedPosition ->
            var position = requestedPosition
            if (position == 2 && shouldShowBiometricsPrompt()) {
            }

            val slide = layoutInflater.inflate(R.layout.onboarding_slide, null)
            strings[position].forEach { (viewId, stringId) ->
                slide.findViewById<TextView>(viewId).text = getString(stringId)
            }
            if ((position == strings.size - 2) || (strings.size == 1)) {
                val button = slide.findViewById<View>(
                    R.id.onboarding_button_auth
                )
                button.visibility = View.VISIBLE
                button.setOnClickListener {
                    ensureLockScreen({ }) {
                        close()
                    }
                }
                val doNotAskButton = slide.findViewById<View>(
                    R.id.onboarding_button_do_not_ask
                )
                doNotAskButton.visibility = View.VISIBLE
                doNotAskButton.setOnClickListener {
                    Preferences.setBiometricCheck(this, false)
                    if (carousel.currentItem == (carousel.pageCount - 1)) {
                        close()
                    } else {
                        carousel.setCurrentItem(carousel.currentItem + 1)
                    }
                }
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
        if (Preferences.isFirstRun(baseContext)) {
            Preferences.setFirstRun(baseContext, false)
        }
        finish()
    }

    fun shouldShowBiometricsPrompt(): Boolean {
        return !Preferences.isFirstRun(this) && biometricsUnavailable() ||
            Preferences.getBiometricCheck(this)
    }
    fun biometricsUnavailable(): Boolean {
        val biometricManager = BiometricManager.from(this)
        if (biometricManager.canAuthenticate(
                desiredLockScreenType
            ) != BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED
        ) {
            return true
        }
        return false
    }

    fun ensureLockScreen(
        noScreenLock: (() -> Unit),
        authAvailable: (() -> Unit)
    ) {
        if (!Preferences.getBiometricCheck(this)) {
            return noScreenLock()
        }
        if (biometricsUnavailable()) {
            return authAvailable()
        }

        val checkBoxView = View.inflate(
            this, R.layout.fragment_checkbox, null
        )
        val checkBox: CheckBox = checkBoxView.findViewById(
            R.id.checkbox
        )
        checkBox.setOnCheckedChangeListener { buttonView, isChecked ->
            Preferences.setBiometricCheck(
                this, !isChecked
            )
        }
        checkBox.setText(R.string.auth_enable_lock_do_not_ask)

        AlertDialog.Builder(this)
            .setTitle(R.string.auth_enable_lock_title)
            .setView(checkBoxView)
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
