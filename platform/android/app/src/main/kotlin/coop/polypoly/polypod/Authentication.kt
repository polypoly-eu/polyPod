package coop.polypoly.polypod

import android.content.Context
import android.widget.Toast
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class Authentication {
    companion object {
        var isAuthenticated = false

        private const val desiredLockScreenType =
            BiometricManager.Authenticators.BIOMETRIC_WEAK or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL

        fun shouldShowBiometricsPrompt(context: Context): Boolean {
            return biometricsAvailable(context) &&
                Preferences.isBiometricCheck(context) &&
                !Preferences.isBiometricEnabled(context) &&
                !Preferences.isFirstRun(context)
        }

        fun shouldAuthenticate(context: Context): Boolean {
            return biometricsAvailable(context) &&
                Preferences.isBiometricEnabled(context) &&
                !isAuthenticated
        }

        fun setUp(
            activity: FragmentActivity,
            showAuthTexts: Boolean,
            newBiometricState: Boolean = false,
            setupComplete: () -> Unit
        ) {
            authenticate(
                activity,
                showAuthTexts,
                newBiometricState
            ) { success ->
                if (success) {
                    Preferences.setBiometricEnabled(
                        activity,
                        showAuthTexts
                    )
                }
                setupComplete()
            }
        }

        fun authenticate(
            activity: FragmentActivity,
            showAuthTexts: Boolean = false,
            newBiometricState: Boolean = false,
            authComplete: ((Boolean) -> Unit)
        ) {
            val isBiometricEnabled = Preferences.isBiometricEnabled(activity)
            if (!biometricsAvailable(activity) ||
                (!newBiometricState && !isBiometricEnabled)
            ) {
                authComplete(true)
                return
            }

            val title =
                if (showAuthTexts)
                    activity.getString(R.string.auth_prompt_title)
                else
                    activity.getString(R.string.re_auth_prompt_title)

            val subtitle =
                if (showAuthTexts)
                    activity.getString(R.string.auth_prompt_subtitle)
                else
                    activity.getString(R.string.re_auth_prompt_subtitle)

            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle(title)
                .setSubtitle(subtitle)
                .setAllowedAuthenticators(desiredLockScreenType)
                .build()

            val executor = ContextCompat.getMainExecutor(activity)
            val callback = PolyAuthCallback(activity, authComplete)

            BiometricPrompt(activity, executor, callback)
                .authenticate(promptInfo)
        }

        private fun biometricsAvailable(context: Context): Boolean {
            val biometricManager = BiometricManager.from(context)
            return biometricManager.canAuthenticate(desiredLockScreenType) ==
                BiometricManager.BIOMETRIC_SUCCESS
        }
    }

    private class PolyAuthCallback(
        val context: Context,
        val authComplete: (Boolean) -> Unit
    ) : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(
            result: BiometricPrompt.AuthenticationResult
        ) {
            super.onAuthenticationSucceeded(result)

            val title =
                if (Preferences.isBiometricEnabled(context))
                    context.getString(R.string.re_auth_prompt_success)
                else
                    context.getString(R.string.auth_prompt_success)

            Toast.makeText(
                context,
                title,
                Toast.LENGTH_SHORT
            ).show()
            isAuthenticated = true

            authComplete(true)
        }

        override fun onAuthenticationError(
            errorCode: Int,
            errString: CharSequence
        ) {
            super.onAuthenticationError(errorCode, errString)
            authComplete(false)
        }

        override fun onAuthenticationFailed() {
            super.onAuthenticationFailed()
            authComplete(false)
        }
    }
}
