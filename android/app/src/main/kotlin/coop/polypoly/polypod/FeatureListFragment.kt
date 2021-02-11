package coop.polypoly.polypod

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.logging.LoggerFactory

/**
 * A simple [Fragment] subclass as the default destination in the navigation.
 */
class FeatureListFragment : Fragment() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private lateinit var recyclerView: RecyclerView
    private lateinit var viewAdapter: RecyclerView.Adapter<*>
    private lateinit var viewManager: RecyclerView.LayoutManager
    private val featureStorage = FeatureStorage()

    override fun onCreateView(
            inflater: LayoutInflater, container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_feature_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        activity?.window?.navigationBarColor = resources.getColor(R.color.featureListBackground, context?.theme)

        val context = requireContext()

        val settingsButton: View = view.findViewById(R.id.settings_button)
        settingsButton.setOnClickListener {
            findNavController().navigate(FeatureListFragmentDirections.actionFeatureListFragmentToSettingsActivity())
        }

        val features = featureStorage.listFeatures(context)

        viewManager = LinearLayoutManager(context)
        viewAdapter = FeatureCardAdapter(this, features)

        recyclerView = view.findViewById(R.id.features_list)
        recyclerView.apply {
            setHasFixedSize(true)
            layoutManager = viewManager
            adapter = viewAdapter
        }

        (if (features.isEmpty()) recyclerView else view.findViewById(R.id.noFeaturesText) as View)
            .visibility = View.GONE
    }
}
