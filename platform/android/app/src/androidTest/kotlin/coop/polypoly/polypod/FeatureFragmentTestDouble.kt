package coop.polypoly.polypod
import android.webkit.WebView
import kotlinx.coroutines.CoroutineScope

class FeatureFragmentTestDouble(
    lifecycleScope: CoroutineScope
) : FeatureFragment(lifecycleScope) {
    fun overridePodApi(podApi: PodApi) {
        featureContainer.api = podApi
    }
    fun retrieveWebView(): WebView {
        return featureContainer.webView
    }
}
