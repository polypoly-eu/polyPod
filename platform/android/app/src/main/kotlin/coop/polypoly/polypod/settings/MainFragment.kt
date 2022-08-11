package coop.polypoly.polypod.settings

import android.app.AlertDialog
import android.content.DialogInterface
import android.os.Bundle
import androidx.navigation.findNavController
import androidx.preference.DropDownPreference
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import androidx.preference.SwitchPreference
import coop.polypoly.polypod.Authentication
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.R
import coop.polypoly.polypod.RuntimeInfo
import org.apache.jena.reasoner.rulesys.builtins.Drop

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

        val dropDownPreference = findPreference<DropDownPreference>("sessionTimeout")
        dropDownPreference?.entries = arrayOf("5 minutes", "15 minutes", "60 minutes", "No Timeout")
        dropDownPreference?.entryValues = arrayOf("5 minutes", "15 minutes", "60 minutes", "No Timeout")
        dropDownPreference?.onPreferenceChangeListener = Preference.OnPreferenceChangeListener { pref, newValue ->
            (pref as DropDownPreference).summary = newValue.toString()
            true
        }
        dropDownPreference?.summary = "5 minutes"

        findPreference<Preference>("imprint")?.onPreferenceClickListener =
            Preference.OnPreferenceClickListener {
                AlertDialog.Builder(requireContext())
                    .setSingleChoiceItems(
                        arrayOf("1","2","3","4"),
                        1) { dInterface, i ->
                        dInterface.dismiss()
                    }.show()
                //view?.findNavController()?.navigate(R.id.ImprintFragment)
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
