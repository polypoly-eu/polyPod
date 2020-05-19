package eu.polypoly.pod.android

import android.util.Log
import android.webkit.JavascriptInterface

private const val TAG = "PodApi"

class PodApi {
    @JavascriptInterface
    public fun log(text: String) {
        Log.d(TAG, "Got message from WebView: '$text'")
    }
}
