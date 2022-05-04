package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.widget.Toast
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class Authentication {
    companion object {
        private const val desiredLockScreenType =
            BiometricManager.Authenticators.BIOMETRIC_WEAK or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL

        fun shouldShowBiometricsPrompt(context: Context): Boolean {
            return biometricsAvailable(context) &&
                Preferences.getBiometricCheck(context) &&
                !Preferences.getBiometricEnabled(context) &&
                !Preferences.isFirstRun(context)
        }

        fun setUp(
            activity: FragmentActivity,
            setupComplete: () -> Unit
        ) {
            authenticate(activity, true) { success ->
                if (success) {
                    setupComplete()
                }
            }
        }

        fun reSetUp(
            activity: FragmentActivity,
            setupComplete: (Boolean) -> Boolean
        ) {
            reAuthenticate(activity, true) { success ->
                if (success) {
                    Preferences.setBiometricEnabled(
                        activity,
                        true
                    )
                    setupComplete(success)
                }
            }
        }

        fun disable(
            activity: FragmentActivity,
            disableComplete: (Boolean) -> Boolean
        ) {
            reAuthenticate(activity, false) { success ->

                if (success) {
                    Preferences.setBiometricEnabled(
                        activity,
                        false
                    )
                    disableComplete(success)
                }
            }
        }

        private fun reAuthenticate(
            activity: FragmentActivity,
            status: Boolean = false,
            authComplete: ((Boolean) -> Unit)
        ) {
            if (!biometricsAvailable(activity) ||
                (!status && !Preferences.getBiometricEnabled(activity))
            ) {
                authComplete(true)
                return
            }

            val alertDialog = AlertDialog.Builder(activity)
            alertDialog.setTitle(
                activity.getString(R.string.re_auth_prompt_title)
            )
            alertDialog.setMessage(
                activity.getString(R.string.re_auth_prompt_subtitle)
            )
            alertDialog.setCancelable(false)

            val positiveButtonClick =
                { dialog: DialogInterface, _: Int ->
                    Toast.makeText(
                        activity,
                        activity.getString(R.string.re_auth_prompt_success),
                        Toast.LENGTH_SHORT
                    ).show()
                    authComplete(true)
                    dialog.dismiss()
                }
            alertDialog.setPositiveButton(
                activity.getString(R.string.re_auth_prompt_confirm),
                positiveButtonClick
            )

            val negativeButtonClick =
                { dialog: DialogInterface, _: Int ->
                    Toast.makeText(
                        activity,
                        activity.getString(R.string.re_auth_prompt_failure),
                        Toast.LENGTH_SHORT
                    ).show()

                    authComplete(false)
                    dialog.cancel()
                }
            alertDialog.setNegativeButton(
                activity.getString(R.string.re_auth_prompt_cancel),
                negativeButtonClick
            )
            alertDialog.create().show()
        }

        fun authenticate(
            activity: FragmentActivity,
            force: Boolean = false,
            authComplete: ((Boolean) -> Unit)
        ) {
            if (!biometricsAvailable(activity) ||
                (!force && !Preferences.getBiometricEnabled(activity))
            ) {
                authComplete(true)
                return
            }

            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle(activity.getString(R.string.auth_prompt_title))
                .setSubtitle(
                    activity.getString(R.string.auth_prompt_subtitle)
                )
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
            Toast.makeText(
                context,
                context.getString(R.string.auth_prompt_success),
                Toast.LENGTH_SHORT
            ).show()
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
