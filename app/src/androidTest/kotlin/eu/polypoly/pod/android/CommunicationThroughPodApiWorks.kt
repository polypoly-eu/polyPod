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
import java.time.Instant

/**
 * Idea - those tests verify that the communication between the Feature and the Pod works.
 * They assume, that the Feature has access to the pod API and that it has been properly initialized. (verified elsewhere)
 * Also, communication doesn't mean that for example `fetch` must correctly work. Here the important thing is
 * that when the Feature calls certain function, the parameters are correctly transferred and the actual function
 * on the Pod side is properly called. Returning results from such calls also needs to be tested here.
 *
 * This class contains just one function annotated with @Test that executes multiple actual tests.
 * That is because starting the fragments takes ~1 second. Running each test separately makes the suite slow.
 * Unfortunately, because Truth and JUnit 4 do not support soft assertions (assert multiple things, but actually fail after the last one if necessary),
 * the first assertion that fails, will fail the whole test. Fixing issues will need to be done one-by-one.
 */
@RunWith(AndroidJUnit4::class)
@LargeTest
class CommunicationThroughPodApiWorks {
    lateinit var podApi: PodApiTestDouble

    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java)

    @Test
    fun masterTest() {
        podApi = launchTestFeature()
        execute { canDoSimpleFetchGet() }
        execute { whenCalledWithNoMethodSpecified_methodIsEmpty() }
        execute { canPassMethodToFetch() }
        execute { canPassSingleHeaderAsString() }
        execute { canPassStaticResponseFromFetch() }
        execute { canPassResponseStatusFromFetch() }
        execute { canPassResponseOKFromFetch() }
        execute { canPassBodyToFetch() }
    }

    private fun execute(test: () -> Unit) {
        podApi.reset()
        test()
    }

    private fun canDoSimpleFetchGet() {
        clickButton("fetch.simple")
        val polyOut = podApi.polyOut
        waitUntil({
            assertThat(polyOut.fetchWasCalled).isTrue()
        })
    }

    private fun whenCalledWithNoMethodSpecified_methodIsEmpty() {
        clickButton("fetch.empty_method")
        val polyOut = podApi.polyOut
        waitUntil({
            assertThat(polyOut.fetchWasCalled).isTrue()
            assertThat(polyOut.fetchInit.method).isNull()
        })
    }

    private fun canPassMethodToFetch() {
        clickButton("fetch.post_method")
        val polyOut = podApi.polyOut
        waitUntil({
            assertThat(polyOut.fetchWasCalled).isTrue()
            assertThat(polyOut.fetchInit.method).isEqualTo("POST")
        })
    }

    private fun canPassSingleHeaderAsString() {
        val key = "key"
        val value = "value"
        setInput(1, key)
        setInput(2, value)
        clickButton("fetch.single_string_header")
        val polyOut = podApi.polyOut
        waitUntil({
            assertThat(polyOut.fetchWasCalled).isTrue()
            val headers = polyOut.fetchInit.headers
            assertThat(headers).hasSize(1)
            assertThat(headers).containsEntry(key, value)
        })
    }

    private fun canPassStaticResponseFromFetch() {
        val polyOut = podApi.polyOut
        val body = "body"
        setInput(1, body)
        polyOut.returnBody(body)
        clickButton("fetch.get_static_response")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            onFeature()
                .withElement(findElement(Locator.ID, "result"))
                .check(webMatches(getText(), `is`(body)))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
    }

    private fun canPassResponseStatusFromFetch() {
        val polyOut = podApi.polyOut
        val status = 418
        setInput(1, "$status")
        polyOut.returnStatus(status)
        clickButton("fetch.get_response_status")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            onFeature()
                .withElement(findElement(Locator.ID, "result"))
                .check(webMatches(getText(), `is`("$status")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
    }

    private fun canPassResponseOKFromFetch() {
        val polyOut = podApi.polyOut
        val ok = true
        setInput(1, "$ok")
        polyOut.returnOk(ok)
        clickButton("fetch.get_response_ok")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            onFeature()
                .withElement(findElement(Locator.ID, "result"))
                .check(webMatches(getText(), `is`("$ok")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
    }

    private fun canPassBodyToFetch() {
        val polyOut = podApi.polyOut
        val body = "example"
        setInput(1, body)
        clickButton("fetch.post_body")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
        assertThat(polyOut.fetchInit.body).isEqualTo(body)
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

    private fun waitUntil(function: () -> Unit, timeout: Long = 2000) {
        // TODO - is there a better way?
        var lastError: AssertionError? = null
        val until = Instant.now().plusMillis(timeout)
        while (Instant.now().isBefore(until)) {
            try {
                function.invoke()
                return
            } catch (err: AssertionError) {
                lastError = err
            }
            Thread.sleep(100)
        }
        throw lastError!!
    }
}
