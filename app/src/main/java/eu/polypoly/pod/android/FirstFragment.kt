package eu.polypoly.pod.android

import android.os.Bundle
import android.text.TextUtils
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController

/**
 * A simple [Fragment] subclass as the default destination in the navigation.
 */
class FirstFragment : Fragment() {

    private lateinit var textView: TextView

    override fun onCreateView(
            inflater: LayoutInflater, container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_first, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<Button>(R.id.button_first).setOnClickListener {
            val action = FirstFragmentDirections.actionFirstFragmentToFeatureFragment("podCheck")
            findNavController().navigate(action)
        }

        val context = requireContext()
        var features = context.assets.list("features")
        if (features.isNullOrEmpty()) {
            features = arrayOf()
        }
        for (feature in features) {
            Log.d("MainActivity", "Found feature: '${feature}'")
        }

        textView = view.findViewById(R.id.features_list)
        textView.text = TextUtils.join("\n", features)
    }
}
