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
import coop.polypoly.polypod.features.Feature
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.logging.LoggerFactory

private fun luminance(color: Int): Double =
    Color.red(color) * 0.2126 +
        Color.green(color) * 0.7152 +
        Color.blue(color) * 0.0722

private enum class ForegroundResources(
    val color: Int,
    val icons: Map<String, Int>
) {
    LIGHT(
        color = R.color.feature_foreground_light,
        icons = mapOf(
            "close" to R.drawable.ic_close_light,
            "back" to R.drawable.ic_back_light,
            "info" to R.drawable.ic_info_light,
            "search" to R.drawable.ic_search_light
        )
    ),
    DARK(
        color = R.color.feature_foreground_dark,
        icons = mapOf(
            "close" to R.drawable.ic_close_dark,
            "back" to R.drawable.ic_back_dark,
            "info" to R.drawable.ic_info_dark,
            "search" to R.drawable.ic_search_dark
        )
    );

    companion object {
        fun fromBackgroundColor(color: Int): ForegroundResources =
            if (luminance(color) > 50) DARK else LIGHT
    }
}

private enum class ActionButton(val action: String, val id: Int) {
    CLOSE("close", R.id.close_button),
    INFO("info", R.id.info_button),
    SEARCH("search", R.id.search_button)
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
        (view.findViewById(R.id.feature_title) as TextView).text =
            args.featureName
        logger.debug(
            "Inside FeatureFragment, feature to load: '{}'",
            args.featureName
        )
        feature =
            FeatureStorage().loadFeature(requireContext(), args.featureFile)
        foregroundResources =
            ForegroundResources.fromBackgroundColor(feature.primaryColor)
        activity?.window?.navigationBarColor = feature.primaryColor
        setupAppBar(view)
        featureContainer = view.findViewById(R.id.feature_container)
        featureContainer.feature = feature
        setupNavigation(view)
    }

    private fun setupAppBar(view: View) {
        view.findViewById<View>(R.id.app_bar)
            .setBackgroundColor(feature.primaryColor)
        view.findViewById<TextView>(R.id.feature_title).setTextColor(
            resources.getColor(
                foregroundResources.color,
                context?.theme
            )
        )

        for (actionButton in ActionButton.values()) {
            val buttonView = view.findViewById<ImageView>(actionButton.id)
            buttonView.setImageResource(
                foregroundResources.icons.getValue(actionButton.action)
            )
            buttonView.setOnClickListener {
                if (actionButton == ActionButton.CLOSE)
                    navigateBack()
                else
                    featureContainer.triggerNavAction(actionButton.action)
            }
        }
    }

    private fun setupNavigation(view: View) {
        requireActivity().onBackPressedDispatcher.addCallback(
            viewLifecycleOwner,
            object : OnBackPressedCallback(true) {
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

    private fun navigateBack() {
        if (!featureContainer.triggerNavAction("back"))
            findNavController().popBackStack()
    }

    private fun updateAppBarActions(view: View, navActions: List<String>) {
        for (actionButton in ActionButton.values()) {
            val buttonView = view.findViewById<ImageView>(actionButton.id)
            if (actionButton == ActionButton.CLOSE) {
                buttonView.setImageResource(
                    foregroundResources.icons.getValue(
                        if ("back" in navActions) "back" else "close"
                    )
                )
                continue
            }
            buttonView.visibility =
                if (actionButton.action in navActions) View.VISIBLE else View.GONE
        }
    }

    private fun updateAppBarTitle(view: View, title: String) {
        view.findViewById<TextView>(R.id.feature_title).text = title
    }
}
