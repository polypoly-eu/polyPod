package coop.polypoly.polypod

import android.webkit.WebView
import androidx.test.core.app.ApplicationProvider
import coop.polypoly.polypod.info.Info
import coop.polypoly.polypod.network.Network
import coop.polypoly.polypod.polyIn.PolyInTestDouble
import coop.polypoly.polypod.polyNav.PolyNav
import coop.polypoly.polypod.polyOut.PolyOutTestDouble

class PodApiTestDouble(
    override val polyOut: PolyOutTestDouble,
    override val polyIn: PolyInTestDouble,
    webView: WebView
) : PodApi(
    polyOut,
    polyIn,
    PolyNav(
        webView = webView,
        context = ApplicationProvider.getApplicationContext()
    ),
    Info(),
    Network(context = ApplicationProvider.getApplicationContext())
) {
    fun reset() {
        polyOut.reset()
        polyIn.reset()
    }
}
