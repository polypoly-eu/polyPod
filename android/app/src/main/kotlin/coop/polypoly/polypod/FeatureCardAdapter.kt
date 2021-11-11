package coop.polypoly.polypod

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import coop.polypoly.polypod.features.Feature

class FeatureCardAdapter(
    private val originatingFragment: Fragment,
    private val features: List<Feature>
) : RecyclerView.Adapter<FeatureCardAdapter.ViewHolder>() {

    class ViewHolder(val featureCardView: View) :
        RecyclerView.ViewHolder(featureCardView)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder {
        val featureCardView = LayoutInflater.from(parent.context)
            .inflate(R.layout.feature_card, parent, false)
        return ViewHolder(featureCardView)
    }

    override fun getItemCount() = features.size

    private fun updateThumbnail(view: View, feature: Feature) {
        val thumbnail = view.findViewById<ImageView>(R.id.thumbnail)
        thumbnail.setBackgroundColor(feature.primaryColor)
        feature.thumbnail?.let {
            thumbnail.setImageBitmap(it)
        }
    }

    private fun updateTexts(view: View, feature: Feature) {
        mapOf(
            R.id.feature_name to feature.name,
            R.id.feature_author to feature.author,
            R.id.feature_description to feature.description
        ).forEach {
            (view.findViewById(it.key) as TextView).text = it.value
        }
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val view = holder.featureCardView
        val feature = features[position]
        updateThumbnail(view, feature)
        updateTexts(view, feature)
        view.setOnClickListener {
            // FIXME - navigation assumes we're coming from FirstFragment,
            // which might not necessary be true
            authorize {
                val action =
                    FeatureListFragmentDirections
                        .actionFeatureListFragmentToFeatureFragment(
                            feature.name,
                            feature.fileName
                        )
                findNavController(originatingFragment).navigate(action)
            }
        }
    }

    fun biometricsUnavailable(): Boolean {
        originatingFragment.context?.let {
            val biometricManager = BiometricManager.from(it)
            if (biometricManager.canAuthenticate(
                    OnboardingActivity.desiredLockScreenType
                ) == BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED
            ) {
                return true
            }
        }
        return false
    }

    fun authorize(successfulAuth: (() -> Unit)) {
        if (biometricsUnavailable()) {
            successfulAuth()
        }
        originatingFragment.context?.let {
            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle(it.getString(R.string.auth_title))
                .setSubtitle(it.getString(R.string.auth_subtitle))
                .setAllowedAuthenticators(
                    OnboardingActivity.desiredLockScreenType
                ).build()

            val executor = ContextCompat.getMainExecutor(it)
            val callback = PolyAuthCallback(it, successfulAuth)

            BiometricPrompt(
                originatingFragment, executor, callback
            ).authenticate(promptInfo)
        }
    }

    class PolyAuthCallback(
        val context: Context,
        val successfulAuth: () -> Unit
    ) : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationError(
            errorCode: Int,
            errString: CharSequence
        ) {
            super.onAuthenticationError(errorCode, errString)
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

            // TODO: Encrypt previously stored unencrypted data, if any
        }

        override fun onAuthenticationFailed() {
            super.onAuthenticationFailed()
        }
    }
}
