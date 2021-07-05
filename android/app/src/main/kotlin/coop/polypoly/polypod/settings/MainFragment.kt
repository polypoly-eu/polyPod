package coop.polypoly.polypod.settings

import android.os.Bundle
import androidx.navigation.findNavController
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import coop.polypoly.polypod.BuildConfig
import coop.polypoly.polypod.R

class MainFragment : PreferenceFragmentCompat() {
    override fun onCreatePreferences(
        savedInstanceState: Bundle?,
        rootKey: String?
    ) {
        setPreferencesFromResource(R.xml.settings, rootKey)
        val version =
            "${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})"
        findPreference<Preference>("version")?.summary = version

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
}
