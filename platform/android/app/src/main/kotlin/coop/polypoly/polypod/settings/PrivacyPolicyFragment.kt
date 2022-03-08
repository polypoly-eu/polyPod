package coop.polypoly.polypod.settings

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import coop.polypoly.polypod.Language
import coop.polypoly.polypod.R

class PrivacyPolicyFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(
            R.layout.fragment_settings_privacy_policy,
            container,
            false
        )
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val policyText =
            view.findViewById<HTMLTextView>(R.id.privacy_policy_text)
        policyText.htmlContent = loadPrivacyPolicyText()
    }

    private fun loadPrivacyPolicyText(): String {
        val locale = Language.determine(requireContext())
        val path = "legal/$locale/privacy-policy.html"
        return context?.assets?.open(path)?.reader()?.readText()?.trim() ?: ""
    }
}
