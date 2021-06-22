package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.updatenotification.UpdateNotification
import kotlin.system.exitProcess

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val context = this
        authorize {
            FeatureStorage().installBundledFeatures(context)
            setContentView(R.layout.activity_main)
            setSupportActionBar(findViewById(R.id.toolbar))
        }
    }

    override fun onResume() {
        super.onResume()
        val context = this
        val notification = UpdateNotification(context)
        notification.markPushNotificationSeen()

        if (Preferences.isFirstRun(context)) {
            notification.markInAppNotificationSeen()
            startActivity(Intent(context, OnboardingActivity::class.java))
            return
        }

        if (!notification.inAppNotificationSeen) {
            AlertDialog.Builder(context)
                .setTitle(notification.title)
                .setMessage(notification.text)
                .setPositiveButton(R.string.button_update_notification_close) { _, _ ->
                    notification.markInAppNotificationSeen()
                }
                .show()
        }
    }

    fun authorize(successfulAuth: (() -> Unit)) {
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle(this.getString(
                R.string.auth_title
            ))
            .setSubtitle(this.getString(
                R.string.auth_subtitle
            ))
            .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
            .build()

        val context = this
        val executor = ContextCompat.getMainExecutor(this)
        val callback = object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationError(
                errorCode: Int,
                errString: CharSequence
            ) {
                super.onAuthenticationError(errorCode, errString)
                Toast.makeText(
                    context,
                    context.getString(R.string.auth_error, errString),
                    Toast.LENGTH_SHORT
                ).show()
                exitProcess(0)
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
                Toast.makeText(
                    context,
                    context.getString(R.string.auth_error, "Canceled"),
                    Toast.LENGTH_SHORT
                ).show()
                exitProcess(0)
            }
        }
        BiometricPrompt(this, executor, callback).authenticate(promptInfo)
    }
}
