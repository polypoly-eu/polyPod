package coop.polypoly.polypod.settings

import android.os.Bundle
import androidx.navigation.findNavController
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
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

        findPreference<Preference>("authentication")?.onPreferenceChangeListener =
            Preference.OnPreferenceChangeListener { preference, newValue ->

                var status = newValue as Boolean;
                println( "Pref " + preference.key + " changed to " + status.toString())

                if (status) {
                    Authentication.setUp(requireActivity()) { success ->
                        if (!success) {
                            println("setup auth failed")
                            false
                        } else {
                            Preferences.setAuthentication(requireContext(), status)
                            println("Enabled auth")
                        }
                    }
                } else {
                    println(requireActivity())
                    Authentication.disable(requireActivity()) { success ->

                        if (!success) {
                            println("disable auth failed")
                            false
                        } else {
                            Preferences.setAuthentication(requireContext(), status)
                            println("Disabled auth")
                        }
                    }
                }

                true
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
}
