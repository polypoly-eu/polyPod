package coop.polypoly.polypod.settings

import android.os.Bundle
import androidx.navigation.findNavController
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import androidx.preference.SwitchPreference
import coop.polypoly.polypod.Authentication
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.R
import coop.polypoly.polypod.RuntimeInfo

class MainFragment : PreferenceFragmentCompat() {
    override fun onCreatePreferences(
        savedInstanceState: Bundle?,
        rootKey: String?
    ) {
        setPreferencesFromResource(R.xml.settings, rootKey)
        findPreference<Preference>("version")?.summary = RuntimeInfo.VERSION

        findPreference<Preference>("biometricEnabledKey")
            ?.onPreferenceChangeListener =
            Preference.OnPreferenceChangeListener { _, newValue ->
                onAuthRequest(newValue as Boolean) {
                    val pref =
                        findPreference<SwitchPreference>("biometricEnabledKey")
                    pref?.isChecked =
                        Preferences.isBiometricEnabled(requireContext())
                }
                false
            }

        findPreference<Preference>("imprint")?.onPreferenceClickListener =
            Preference.OnPreferenceClickListener {
                view?.findNavController()?.navigate(R.id.ImprintFragment)
                true
            }
        findPreference<Preference>("privacy_policy")
            ?.onPreferenceClickListener =
            Preference.OnPreferenceClickListener {
                view?.findNavController()?.navigate(R.id.PrivacyPolicyFragment)
                true
            }
        findPreference<Preference>("terms_of_use")?.onPreferenceClickListener =
            Preference.OnPreferenceClickListener {
                view?.findNavController()?.navigate(R.id.TermsOfUseFragment)
                true
            }
        findPreference<Preference>("licenses")?.onPreferenceClickListener =
            Preference.OnPreferenceClickListener {
                view?.findNavController()?.navigate(R.id.LicensesFragment)
                true
            }
    }

    private fun onAuthRequest(newStatus: Boolean, onReturn: () -> Unit) {
        Authentication.setUp(
            requireActivity(),
            newStatus
        ) {
            onReturn()
        }
    }
}
