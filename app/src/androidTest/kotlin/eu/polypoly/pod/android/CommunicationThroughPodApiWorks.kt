package eu.polypoly.pod.android

import android.os.Bundle
import androidx.fragment.app.testing.launchFragmentInContainer
import androidx.test.espresso.web.assertion.WebViewAssertions.webMatches
import androidx.test.espresso.web.sugar.Web.onWebView
import androidx.test.espresso.web.webdriver.DriverAtoms.*
import androidx.test.espresso.web.webdriver.Locator
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.rule.ActivityTestRule
import com.google.common.truth.Truth.assertThat
import eu.polypoly.pod.android.polyOut.PolyOutTestDouble
import org.hamcrest.CoreMatchers.`is`
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Idea - those tests verify that the communication between the Feature and the Pod works.
 * They assume, that the Feature has access to the pod API and that it has been properly initialized. (verified elsewhere)
 * Also, communication doesn't mean that for example `fetch` must correctly work. Here the important thing is
 * that when the Feature calls certain function, the parameters are correctly transferred and the actual function
 * on the Pod side is properly called. Returning results from such calls also needs to be tested here.
 */
@RunWith(AndroidJUnit4::class)
@LargeTest
class CommunicationThroughPodApiWorks {

    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java)

    @Test
    fun canDoSimpleFetchGet() {
        val podApi = launchTestFeature()
        clickButton("fetch.simple")
        Thread.sleep(2000)  // TODO - how _not_ to wait?
        val polyOut = podApi.polyOut as PolyOutTestDouble
        assertThat(polyOut.fetchWasCalled).isTrue()
    }

    @Test
    fun whenCalledWithNoMethodSpecified_methodIsEmpty() {
        val podApi = launchTestFeature()
        clickButton("fetch.empty_method")
        Thread.sleep(2000)  // TODO - how _not_ to wait?
        val polyOut = podApi.polyOut as PolyOutTestDouble
        assertThat(polyOut.fetchWasCalled).isTrue()
        assertThat(polyOut.fetchInit.method).isNull()
    }

    @Test
    fun canPassMethodToFetch() {
        val podApi = launchTestFeature()
        clickButton("fetch.post_method")
        Thread.sleep(2000)  // TODO - how _not_ to wait?
        val polyOut = podApi.polyOut as PolyOutTestDouble
        assertThat(polyOut.fetchWasCalled).isTrue()
        assertThat(polyOut.fetchInit.method).isEqualTo("POST")
    }

    @Test
    fun canPassSingleHeaderAsString() {
        val podApi = launchTestFeature()
        val key = "key"
        val value = "value"
        setInput(1, key)
        setInput(2, value)
        clickButton("fetch.single_string_header")
        Thread.sleep(2000)  // TODO - how _not_ to wait?
        val polyOut = podApi.polyOut as PolyOutTestDouble
        assertThat(polyOut.fetchWasCalled).isTrue()
        val headers = polyOut.fetchInit.headers
        assertThat(headers).hasSize(1)
        assertThat(headers).containsEntry(key, value)
    }

    @Test
    fun canPassStaticResponseFromFetch() {
        val podApi = launchTestFeature()
        val polyOut = podApi.polyOut as PolyOutTestDouble
        val body = "body"
        setInput(1, body)
        polyOut.returnBody(body)
        clickButton("fetch.get_static_response")
        Thread.sleep(2000)  // TODO - how _not_ to wait?
        assertThat(polyOut.fetchWasCalled).isTrue()
        onFeature()
            .withElement(findElement(Locator.ID, "status"))
            .check(webMatches(getText(), `is`("All OK")))
        onFeature()
            .withElement(findElement(Locator.ID, "result"))
            .check(webMatches(getText(), `is`(body)))
    }

    @Test
    fun canPassResponseStatusFromFetch() {
        val podApi = launchTestFeature()
        val polyOut = podApi.polyOut as PolyOutTestDouble
        val status = 418
        setInput(1, "$status")
        polyOut.returnStatus(status)
        clickButton("fetch.get_response_status")
        Thread.sleep(2000)  // TODO - how _not_ to wait?
        assertThat(polyOut.fetchWasCalled).isTrue()
        onFeature()
            .withElement(findElement(Locator.ID, "status"))
            .check(webMatches(getText(), `is`("All OK")))
        onFeature()
            .withElement(findElement(Locator.ID, "result"))
            .check(webMatches(getText(), `is`("$status")))
    }

    @Test
    fun canPassResponseOKFromFetch() {
        val podApi = launchTestFeature()
        val polyOut = podApi.polyOut as PolyOutTestDouble
        val ok = true
        setInput(1, "$ok")
        polyOut.returnOk(ok)
        clickButton("fetch.get_response_ok")
        Thread.sleep(2000)  // TODO - how _not_ to wait?
        assertThat(polyOut.fetchWasCalled).isTrue()
        onFeature()
            .withElement(findElement(Locator.ID, "status"))
            .check(webMatches(getText(), `is`("All OK")))
        onFeature()
            .withElement(findElement(Locator.ID, "result"))
            .check(webMatches(getText(), `is`("$ok")))
    }

    private fun launchTestFeature(): PodApiTestDouble {
        val fragmentArgs = Bundle().apply {
            putString("featureName", "testFeature")
        }
        val fragmentScenario = launchFragmentInContainer<FeatureFragmentTestDouble>(fragmentArgs)
        val polyOut = PolyOutTestDouble()
        val podApi = PodApiTestDouble(polyOut)
        fragmentScenario.onFragment { fragment ->
            fragment.overridePodApi(podApi)
        }
        return podApi
    }

    private fun onFeature() =
        onWebView()
            .inWindow(selectFrameByIdOrName("harness"))

    private fun setInput(idx: Int, value: String) {
        onFeature()
            .withElement(findElement(Locator.ID, "input.$idx"))
            .perform(clearElement())
            .perform(webKeys(value))
    }

    private fun clickButton(id: String) {
        onFeature()
            .withElement(findElement(Locator.ID, id))
            .perform(webClick())
    }
}
