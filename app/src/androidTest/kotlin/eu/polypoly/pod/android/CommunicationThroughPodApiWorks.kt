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
import eu.polypoly.pod.android.polyIn.PolyInTestDouble
import eu.polypoly.pod.android.polyIn.rdf.IRI
import eu.polypoly.pod.android.polyIn.rdf.Quad
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
        execute { canCallPolyInAddWithNoQuads() }
        execute { canPassSingleQuadToPolyInAdd() }
        execute { canPassMultipleQuadsToPolyInAdd() }
    }

    private fun execute(test: () -> Unit) {
        podApi.reset()
        test()
    }

    private fun canDoSimpleFetchGet() {
        clickButton("comm.polyOut.fetch.simple")
        val polyOut = podApi.polyOut
        waitUntil({
            assertThat(polyOut.fetchWasCalled).isTrue()
        })
    }

    private fun whenCalledWithNoMethodSpecified_methodIsEmpty() {
        clickButton("comm.polyOut.fetch.empty_method")
        val polyOut = podApi.polyOut
        waitUntil({
            assertThat(polyOut.fetchWasCalled).isTrue()
            assertThat(polyOut.fetchInit.method).isNull()
        })
    }

    private fun canPassMethodToFetch() {
        clickButton("comm.polyOut.fetch.post_method")
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
        clickButton("comm.polyOut.fetch.single_string_header")
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
        clickButton("comm.polyOut.fetch.get_static_response")
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
        clickButton("comm.polyOut.fetch.get_response_status")
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
        clickButton("comm.polyOut.fetch.get_response_ok")
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
        clickButton("comm.polyOut.fetch.post_body")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
        assertThat(polyOut.fetchInit.body).isEqualTo(body)
    }

    private fun canCallPolyInAddWithNoQuads() {
        val polyIn = podApi.polyIn
        clickButton("comm.polyIn.add.no_quads")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(0)
    }

    private fun canPassSingleQuadToPolyInAdd() {
        val podApi = launchTestFeature()
        val polyIn = podApi.polyIn
        val subject = "http://example.org/s"
        val predicate = "http://example.org/p"
        val `object` = "http://example.org/o"
        val graph = "http://example.org/g"
        val quad = Quad(IRI(subject), IRI(predicate), IRI(`object`), IRI(graph))
        setInput(1, subject)
        setInput(2, predicate)
        setInput(3, `object`)
        setInput(4, graph)
        clickButton("comm.polyIn.add.single_quad")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun canPassMultipleQuadsToPolyInAdd() {
        val podApi = launchTestFeature()
        val polyIn = podApi.polyIn

        val subject1 = "http://example.org/s1"
        val predicate1 = "http://example.org/p1"
        val object1 = "http://example.org/o1"
        val graph1 = "http://example.org/g1"
        val quad1 = Quad(IRI(subject1), IRI(predicate1), IRI(object1), IRI(graph1))
        setInput(1, subject1)
        setInput(2, predicate1)
        setInput(3, object1)
        setInput(4, graph1)
        clickButton("comm.polyIn.add.add_quad_to_collection")

        val subject2 = "http://example.org/s1"
        val predicate2 = "http://example.org/p1"
        val object2 = "http://example.org/o1"
        val graph2 = "http://example.org/g1"
        val quad2 = Quad(IRI(subject2), IRI(predicate2), IRI(object2), IRI(graph2))
        setInput(1, subject2)
        setInput(2, predicate2)
        setInput(3, object2)
        setInput(4, graph2)
        clickButton("comm.polyIn.add.add_quad_to_collection")

        clickButton("comm.polyIn.add.multiple_quads")
        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(2)
        assertThat(polyIn.addParams).containsExactlyElementsIn(arrayOf(quad1, quad2))
    }

    // test functions above, helper function below

    private fun launchTestFeature(): PodApiTestDouble {
        val fragmentArgs = Bundle().apply {
            putString("featureName", "testFeature")
        }
        val fragmentScenario = launchFragmentInContainer<FeatureFragmentTestDouble>(fragmentArgs)
        val polyOut = PolyOutTestDouble()
        val polyIn = PolyInTestDouble()
        val podApi = PodApiTestDouble(polyOut, polyIn)
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
