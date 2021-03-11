package coop.polypoly.polypod

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.features.Feature
import coop.polypoly.polypod.logging.LoggerFactory

private fun luminance(color: Int): Double = Color.red(color) * 0.2126 + Color.green(color) * 0.7152 + Color.blue(color) * 0.0722

private enum class ForegroundResources(
    val color: Int,
    val closeIcon: Int,
    val backIcon: Int,
    val infoIcon: Int,
    val searchIcon: Int
) {
    LIGHT(
        color = R.color.feature_foreground_light,
        closeIcon = R.drawable.ic_close_light,
        backIcon = R.drawable.ic_back_light,
        infoIcon = R.drawable.ic_info_light,
        searchIcon = R.drawable.ic_search_light
    ),
    DARK(
        color = R.color.feature_foreground_dark,
        closeIcon = R.drawable.ic_close_dark,
        backIcon = R.drawable.ic_back_dark,
        infoIcon = R.drawable.ic_info_dark,
        searchIcon = R.drawable.ic_search_dark
    );

    companion object {
        fun fromBackgroundColor(color: Int): ForegroundResources = if (luminance(color) > 50) DARK else LIGHT
    }
}

/**
 * A [Fragment] that is responsible for handling a single Feature
 */
open class FeatureFragment : Fragment() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val args: FeatureFragmentArgs by navArgs()

    private lateinit var feature: Feature
    private lateinit var foregroundResources: ForegroundResources
    private lateinit var featureContainer: FeatureContainer

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_feature, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        (view.findViewById(R.id.feature_title) as TextView).text = args.featureName
        logger.debug("Inside FeatureFragment, feature to load: '{}'", args.featureName)
        feature = FeatureStorage().loadFeature(requireContext(), args.featureFile)
        foregroundResources = ForegroundResources.fromBackgroundColor(feature.primaryColor)
        activity?.window?.navigationBarColor = feature.primaryColor
        setupAppBar(view)
        featureContainer = view.findViewById(R.id.feature_container)
        featureContainer.feature = feature
        setupNavigation(view)
    }

    private fun setupAppBar(view: View) {
        view.findViewById<View>(R.id.app_bar).setBackgroundColor(feature.primaryColor)
        view.findViewById<TextView>(R.id.feature_title).setTextColor(resources.getColor(foregroundResources.color, context?.theme))

        val closeButton = view.findViewById<ImageView>(R.id.close_button)
        closeButton.setImageResource(foregroundResources.closeIcon)
        closeButton.setOnClickListener {
            navigateBack()
        }

        val infoButton = view.findViewById<ImageView>(R.id.info_button)
        infoButton.setImageResource(foregroundResources.infoIcon)
        infoButton.setOnClickListener {
            featureContainer.triggerNavAction("info")
        }

        val searchButton = view.findViewById<ImageView>(R.id.search_button)
        searchButton.setImageResource(foregroundResources.searchIcon)
        searchButton.setOnClickListener {
            featureContainer.triggerNavAction("search")
        }
    }

    private fun navigateBack() {
        if (!featureContainer.triggerNavAction("back"))
            findNavController().popBackStack()
    }

    private fun setupNavigation(view: View) {
        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() = navigateBack()
        })
        featureContainer.navTitleChangedHandler = {
            activity?.runOnUiThread {
                updateAppBarTitle(view, it)
            }
        }

        featureContainer.navActionsChangedHandler = {
            activity?.runOnUiThread {
                updateAppBarActions(view, it)
            }
        }
    }

    private fun updateAppBarActions(view: View, navActions: List<String>) {
        view.findViewById<ImageView>(R.id.close_button).setImageResource(
            if (navActions.contains("back")) foregroundResources.backIcon
            else foregroundResources.closeIcon
        )
        view.findViewById<View>(R.id.info_button).visibility =
            if (navActions.contains("info")) View.VISIBLE else View.GONE
        view.findViewById<View>(R.id.search_button).visibility =
            if (navActions.contains("search")) View.VISIBLE else View.GONE
    }

    private fun updateAppBarTitle(view: View, title: String) {
        view.findViewById<TextView>(R.id.feature_title).text = title
    }
}
