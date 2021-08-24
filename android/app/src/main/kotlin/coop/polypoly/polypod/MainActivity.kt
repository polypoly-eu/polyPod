package coop.polypoly.polypod

import android.app.AlertDialog
import android.app.admin.DevicePolicyManager
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.CheckBox
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.updatenotification.UpdateNotification

class MainActivity : AppCompatActivity() {

    private var initialized = false
    val desiredLockScreenType =
        BiometricManager.Authenticators.BIOMETRIC_WEAK or
            BiometricManager.Authenticators.DEVICE_CREDENTIAL

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onResume() {
        super.onResume()
        if (!initialized) {
            initialized = true
            authorize {
                FeatureStorage().installBundledFeatures(this)
                setContentView(R.layout.activity_main)
                setSupportActionBar(findViewById(R.id.toolbar))
            }
        }

        val notification = UpdateNotification(this)
        notification.markPushNotificationSeen()

        if (Preferences.isFirstRun(this)) {
            notification.markInAppNotificationSeen()
            startActivity(
                Intent(
                    this,
                    OnboardingActivity::class.java
                )
            )
            return
        }

        if (!notification.inAppNotificationSeen) {
            AlertDialog.Builder(this)
                .setTitle(notification.title)
                .setMessage(notification.text)
                .setPositiveButton(
                    R.string.button_update_notification_close
                ) { _, _ ->
                    notification.markInAppNotificationSeen()
                }
                .show()
        }
    }

    fun authorize(successfulAuth: (() -> Unit)) {
        ensureLockScreen(successfulAuth) {
            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle(this.getString(R.string.auth_title))
                .setSubtitle(this.getString(R.string.auth_subtitle))
                .setAllowedAuthenticators(desiredLockScreenType)
                .build()

            val executor = ContextCompat.getMainExecutor(this)
            val callback = PolyAuthCallback(this, successfulAuth)

            BiometricPrompt(this, executor, callback).authenticate(promptInfo)
        }
    }

    fun ensureLockScreen(
        noScreenLock: (() -> Unit),
        biometricAuth: (() -> Unit)
    ) {
        if (!Preferences.getBiometricCheck(this)) {
            return noScreenLock()
        }
        val biometricManager = BiometricManager.from(this)
        if (biometricManager.canAuthenticate(
                desiredLockScreenType
            ) != BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED
        ) {
            return biometricAuth()
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

    class PolyAuthCallback(
        val context: MainActivity,
        val successfulAuth: () -> Unit
    ) : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationError(
            errorCode: Int,
            errString: CharSequence
        ) {
            super.onAuthenticationError(errorCode, errString)
            context.finish()
        }

        override fun onAuthenticationSucceeded(
            result: BiometricPrompt.AuthenticationResult
        ) {
            super.onAuthenticationSucceeded(result)
            Toast.makeText(
                context,
                context.getString(R.string.auth_success),
                Toast.LENGTH_SHORT
            ).show()

            successfulAuth()
        }

        override fun onAuthenticationFailed() {
            super.onAuthenticationFailed()
            context.finish()
        }
    }
}
