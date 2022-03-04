package coop.polypoly.polypod.settings

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import coop.polypoly.polypod.R

class LicensesFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(
            R.layout.fragment_settings_licenses,
            container,
            false
        )
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val licenseText = view.findViewById<TextView>(R.id.license_text)
        licenseText.text = loadLicenseText()
    }

    private fun loadLicenseText(): String {
        val licenseFiles = listOf("android-licenses.txt", "js-licenses.txt")
        val assetManager = context?.assets
        val licenseDir = "3rd-party-licenses"
        val licenses = licenseFiles.map { file ->
            assetManager?.open("$licenseDir/$file")?.reader()?.readText()
                ?.trim()
        }
        return licenses.joinToString("\n\n\n")
    }
}
