package coop.polypoly.polypod.settings

import android.app.AlertDialog
import android.os.Bundle
import androidx.navigation.findNavController
import androidx.preference.DropDownPreference
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import androidx.preference.SwitchPreference
import coop.polypoly.core.Core
import coop.polypoly.core.UserSessionTimeoutOption
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

        val timeoutOptionsConfig = Core.getUserSessionTimeoutOptionsConfig()
        val selectedOption = Core.getUserSessionTimeoutOption()
        val timeoutDurationsMap: LinkedHashMap<String, String> = linkedMapOf()
        timeoutOptionsConfig.forEach {
            val duration = if (it.duration != null) {
                requireContext().getString(
                    R.string.screen_lock_inactivity_timeout_duration,
                    it.duration
                )
            } else {
                requireContext().getString(
                    R.string.screen_lock_inactivity_no_timeout
                )
            }
            timeoutDurationsMap[it.option.name] = duration
        }

        val dropDownPreference = findPreference<DropDownPreference>("sessionTimeout")
        dropDownPreference?.entries = timeoutDurationsMap.values.toTypedArray()
        dropDownPreference?.entryValues = timeoutDurationsMap.keys.toTypedArray()
        dropDownPreference?.onPreferenceChangeListener = Preference.OnPreferenceChangeListener { pref, newValue ->
            (pref as DropDownPreference).summary = timeoutDurationsMap[newValue.toString()]
            Core.setUserSessionTimeoutOption(UserSessionTimeoutOption.valueOf(newValue.toString()))
            true
        }
        dropDownPreference?.summary = timeoutDurationsMap[selectedOption.name]
        dropDownPreference?.isVisible =
            Preferences.isBiometricEnabled(requireContext())

        findPreference<Preference>("biometricEnabledKey")
            ?.onPreferenceChangeListener =
            Preference.OnPreferenceChangeListener { _, newValue ->
                onAuthRequest(newValue as Boolean) {
                    val pref =
                        findPreference<SwitchPreference>("biometricEnabledKey")
                    pref?.isChecked =
                        Preferences.isBiometricEnabled(requireContext())
                    dropDownPreference?.isVisible =
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

    private fun onAuthRequest(newValue: Boolean, onReturn: () -> Unit) {
        Authentication.setUp(
            requireActivity(),
            showAuthTexts = false,
            newBiometricState = newValue
        ) {
            onReturn()
        }
    }
}
