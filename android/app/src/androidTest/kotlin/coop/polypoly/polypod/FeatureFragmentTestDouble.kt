package coop.polypoly.polypod

import android.webkit.WebView

class FeatureFragmentTestDouble : FeatureFragment() {
    fun overridePodApi(podApi: PodApi) {
        featureContainer.api = podApi
    }
    fun retrieveWebView(): WebView {
        return featureContainer.webView
    }
}
