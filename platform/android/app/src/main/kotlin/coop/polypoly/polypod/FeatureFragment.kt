package coop.polypoly.polypod

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.DocumentsContract
import android.provider.OpenableColumns
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import coop.polypoly.polypod.endpoint.EndpointObserver
import coop.polypoly.polypod.features.Feature
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.polyNav.PolyNavObserver
import kotlinx.coroutines.CompletableDeferred

private const val PICK_FILE_REQUEST_CODE = 1

private fun luminance(color: Int): Double =
    Color.red(color) * 0.2126 +
        Color.green(color) * 0.7152 +
        Color.blue(color) * 0.0722

private enum class Action(val id: String) {
    CLOSE("close"),
    BACK("back"),
    INFO("info"),
    SEARCH("search")
}

private enum class ForegroundResources(
    val color: Int,
    val icons: Map<Action, Int>
) {
    LIGHT(
        color = R.color.feature_foreground_light,
        icons = mapOf(
            Action.CLOSE to R.drawable.ic_close_light,
            Action.BACK to R.drawable.ic_back_light,
            Action.INFO to R.drawable.ic_info_light,
            Action.SEARCH to R.drawable.ic_search_light
        )
    ),
    DARK(
        color = R.color.feature_foreground_dark,
        icons = mapOf(
            Action.CLOSE to R.drawable.ic_close_dark,
            Action.BACK to R.drawable.ic_back_dark,
            Action.INFO to R.drawable.ic_info_dark,
            Action.SEARCH to R.drawable.ic_search_dark
        )
    );

    companion object {
        fun fromBackgroundColor(color: Int): ForegroundResources =
            if (luminance(color) > 80) DARK else LIGHT
    }
}

private enum class ActionButton(val action: Action, val buttonId: Int) {
    CLOSE(Action.CLOSE, R.id.close_button),
    INFO(Action.INFO, R.id.info_button),
    SEARCH(Action.SEARCH, R.id.search_button)
}

data class ExternalFile(val url: String, val name: String, val size: Long)

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

    private val errorDialog: AlertDialog by lazy {
        AlertDialog.Builder(context)
            .setPositiveButton(
                context?.getString(R.string.button_feature_error_close)
            ) { _, _ ->
                close()
            }
            .create()
    }

    private var pickFileResult: CompletableDeferred<Uri?>? = null
    private var fetchApproval: CompletableDeferred<Boolean?>? = null


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = inflater.inflate(R.layout.fragment_feature, container, false)

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

        setupFeature(view)
    }

    private fun setupFeature(view: View) {
        foregroundResources =
            ForegroundResources.fromBackgroundColor(feature.primaryColor)
        activity?.window?.navigationBarColor = feature.primaryColor
        setupAppBar(view)
        featureContainer = view.findViewById(R.id.feature_container)
        featureContainer.errorHandler = ::handleError
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
            val buttonView = view.findViewById<ImageView>(actionButton.buttonId)
            buttonView.setImageResource(
                foregroundResources.icons.getValue(actionButton.action)
            )
            buttonView.setOnClickListener {
                if (actionButton == ActionButton.CLOSE)
                    navigateBack()
                else
                    featureContainer.triggerNavAction(actionButton.action.id)
            }
        }
    }

    @Suppress("unused")
    private fun handleError(error: String) {
        val featureErrorMessage = context?.getString(
            R.string.message_feature_error,
            feature.name,
            error
        )
        if (errorDialog.isShowing) return
        errorDialog.setMessage(featureErrorMessage)
        errorDialog.show()
    }

    private fun setupNavigation(view: View) {
        requireActivity().onBackPressedDispatcher.addCallback(
            viewLifecycleOwner,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() = navigateBack()
            }
        )

        featureContainer.api.polyNav.setNavObserver(
            PolyNavObserver(
                {
                    activity?.runOnUiThread { updateAppBarActions(view, it) }
                },
                {
                    activity?.runOnUiThread { updateAppBarTitle(view, it) }
                },
                {
                    activity?.runOnUiThread { featureContainer.openUrl(it) }
                },
                ::pickFile
            )
        )
        featureContainer.api.endpoint.setEndpointObserver(
            EndpointObserver(
                ::approveEndpointFetch
            )
        )
    }

    private fun navigateBack() {
        if (!featureContainer.triggerNavAction("back"))
            close()
    }

    private fun close() {
        findNavController().popBackStack()
    }

    private fun updateAppBarActions(view: View, navActions: List<String>) {
        for (actionButton in ActionButton.values()) {
            val buttonView = view.findViewById<ImageView>(actionButton.buttonId)
            if (actionButton == ActionButton.CLOSE) {
                buttonView.setImageResource(
                    foregroundResources.icons.getValue(
                        if (Action.BACK.id in navActions) Action.BACK
                        else Action.CLOSE
                    )
                )
                continue
            }
            buttonView.visibility =
                if (actionButton.action.id in navActions) View.VISIBLE
                else View.GONE
        }
    }

    private fun updateAppBarTitle(view: View, title: String) {
        view.findViewById<TextView>(R.id.feature_title).text = title
    }

    private suspend fun approveEndpointFetch(endpointId: String?): Boolean? {
        System.out.println("YAAAAAAAA")
        if (fetchApproval?.isActive == true)
            return null
        fetchApproval = CompletableDeferred()
        val featureName = feature?.name ?: return null
        if (endpointId == null) {
            return null
        }

        val message = context?.getString(
            R.string.message_url_open_requested, featureName, endpointId
        )
        var result = false
        (fetchApproval?.await())?.let{
            it.let{
                val confirmLabel = context?.getString(R.string.button_url_open_confirm)
                val rejectLabel = context?.getString(R.string.button_url_open_reject)
                AlertDialog.Builder(context)
                    .setMessage(message)
                    .setPositiveButton(confirmLabel) { _, _ ->
                        result = true
                    }
                    .setNegativeButton(rejectLabel) { _, _ ->
                        result = false
                    }
                    .show()
            }
        }
        return result
    }

    private suspend fun pickFile(type: String?): ExternalFile? {
        if (pickFileResult?.isActive == true)
            return null
        pickFileResult = CompletableDeferred()
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            setTypeAndNormalize(type ?: "*/*")
            // TODO: Figure out how to preselect the downloads directory
            //       on Android <26
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                putExtra(
                    DocumentsContract.EXTRA_INITIAL_URI,
                    Environment.DIRECTORY_DOWNLOADS
                )
            }
        }
        startActivityForResult(intent, PICK_FILE_REQUEST_CODE)
        var url: String = ""
        var name: String = ""
        var size: Long = 0
        (pickFileResult?.await())?.let {
            it.let { returnUri ->
                url = returnUri.toString()
                context?.contentResolver
                    ?.query(returnUri, null, null, null, null)
            }?.use { cursor ->
                if (cursor.moveToFirst()) {
                    val nameIndex =
                        cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)
                    name = cursor.getString(nameIndex)
                    size = cursor.getLong(sizeIndex)
                }
            }
        }
        return ExternalFile(url = url, name = name, size = size)
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == PICK_FILE_REQUEST_CODE)
            handlePickFileResult(resultCode, data)
    }

    private fun handlePickFileResult(resultCode: Int, data: Intent?) {
        if (resultCode != Activity.RESULT_OK || data?.data == null) {
            pickFileResult?.complete(null)
            return
        }
        val fileUri = data.data!!
        pickFileResult?.complete(fileUri)
    }
}
