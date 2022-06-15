package coop.polypoly.polypod

// TODO: Fix compile errors
/*
import android.os.Bundle
import androidx.fragment.app.testing.launchFragmentInContainer
import androidx.test.core.app.ApplicationProvider
import androidx.test.espresso.web.assertion.WebViewAssertions.webMatches
import androidx.test.espresso.web.sugar.Web.onWebView
import androidx.test.espresso.web.webdriver.DriverAtoms.clearElement
import androidx.test.espresso.web.webdriver.DriverAtoms.findElement
import androidx.test.espresso.web.webdriver.DriverAtoms.getText
import androidx.test.espresso.web.webdriver.DriverAtoms.selectFrameByIdOrName
import androidx.test.espresso.web.webdriver.DriverAtoms.webClick
import androidx.test.espresso.web.webdriver.DriverAtoms.webKeys
import androidx.test.espresso.web.webdriver.Locator
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.google.common.truth.Truth.assertThat
import coop.polypoly.polypod.polyIn.PolyInTestDouble
import coop.polypoly.polypod.polyIn.rdf.BlankNode
import coop.polypoly.polypod.polyIn.rdf.BlankNodeGraph
import coop.polypoly.polypod.polyIn.rdf.BlankNodeObject
import coop.polypoly.polypod.polyIn.rdf.BlankNodeSubject
import coop.polypoly.polypod.polyIn.rdf.DefaultGraph
import coop.polypoly.polypod.polyIn.rdf.IRI
import coop.polypoly.polypod.polyIn.rdf.IRIGraph
import coop.polypoly.polypod.polyIn.rdf.IRIObject
import coop.polypoly.polypod.polyIn.rdf.IRISubject
import coop.polypoly.polypod.polyIn.rdf.Literal
import coop.polypoly.polypod.polyIn.rdf.LiteralObject
import coop.polypoly.polypod.polyIn.rdf.Quad
import coop.polypoly.polypod.polyIn.rdf.QuadBuilder
import coop.polypoly.polypod.polyIn.rdf.QuadGraph
import coop.polypoly.polypod.polyIn.rdf.QuadObject
import coop.polypoly.polypod.polyIn.rdf.QuadSubject
import coop.polypoly.polypod.polyOut.PolyOutTestDouble
import org.hamcrest.CoreMatchers.`is`
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.util.Date

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
 *
 * Also, this file contains only half of the code for each test.
 * The other half is in testFeature/src/test.js.
 * Method names match on both sides so it should not be hard to find all code related to any single test.
 * Still, some assertions are made on JavaScript side so some failures can look awkward.
 */
@RunWith(AndroidJUnit4::class)
@LargeTest
class CommunicationThroughPodApiWorks {
    private lateinit var podApi: PodApiTestDouble
    private lateinit var polyOut: PolyOutTestDouble
    private lateinit var polyIn: PolyInTestDouble

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    // TODO: fetch instrumentation tests are disabled for now
    // @Test
    fun polyOut() {
        podApi = launchTestFeature()
        polyOut = podApi.polyOut
        execute { whenCalledWithNoMethodSpecified_methodIsEmpty() }
        execute { canPassMethodToFetch() }
        execute { canPassSingleHeaderAsString() }
        execute { canPassMultipleHeadersAsString() }
        execute { canPassStaticResponseFromFetch() }
        execute { canPassResponseStatusFromFetch() }
        execute { canPassResponseOKFromFetch() }
        execute { canPassBodyToFetch() }
    }

    @Test
    fun polyIn() {
        podApi = launchTestFeature()
        polyIn = podApi.polyIn
        execute { canCallPolyInAddWithNoQuads() }
        execute { canPassSingleQuadToPolyInAdd() }
        execute { canPassMultipleQuadsToPolyInAdd() }
        execute { addSupportsQuadsWithIRISubject() }
        execute { addSupportsQuadsWithBlankNodeSubject() }
        execute { addSupportsQuadsWithIRIObject() }
        execute { addSupportsQuadsWithBlankNodeObject() }
        execute { addSupportsQuadsWithLiteralObject() }
        execute { addSupportsQuadsWithIRIGraph() }
        execute { addSupportsQuadsWithBlankNodeGraph() }
        execute { addSupportsQuadsWithDefaultGraph() }
        execute { canPassEmptyMatcherToPolyInMatch() }
        execute { canPassMatcherWithSubjectToPolyInMatch() }
        execute { canPassMatcherWithPredicateToPolyInMatch() }
        execute { canPassMatcherWithObjectToPolyInMatch() }
        execute { canPassMatcherWithAllThreeFieldsToPolyInMatch() }
        execute { canGetEmptyArrayFromPolyInMatch() }
        execute { canGetArrayWithSingleQuadFromPolyInMatch() }
        execute { canGetArrayWithSingleQuadWithIRISubjectFromPolyInMatch() }
        execute {
            canGetArrayWithSingleQuadWithBlankNodeSubjectFromPolyInMatch()
        }
        execute { canGetArrayWithSingleQuadWithIRIObjectFromPolyInMatch() }
        execute {
            canGetArrayWithSingleQuadWithBlankNodeObjectFromPolyInMatch()
        }
        execute { canGetArrayWithSingleQuadWithLiteralObjectFromPolyInMatch() }
        execute { canGetArrayWithSingleQuadWithIRIGraphFromPolyInMatch() }
        execute {
            canGetArrayWithSingleQuadWithBlankNodeGraphFromPolyInMatch()
        }
        execute { canGetArrayWithSingleQuadWithDefaultGraphFromPolyInMatch() }
        execute { canGetArrayWithMultipleQuadsFromPolyInMatch() }
    }

    private fun whenCalledWithNoMethodSpecified_methodIsEmpty() {
        clickButton("comm.polyOut.fetch.empty_method")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
        assertThat(polyOut.fetchInit.method).isNull()
    }

    private fun canPassMethodToFetch() {
        clickButton("comm.polyOut.fetch.post_method")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
        assertThat(polyOut.fetchInit.method).isEqualTo("POST")
    }

    private fun canPassSingleHeaderAsString() {
        val key = "key"
        val value = "value"
        setInputs(key, value)

        clickButton("comm.polyOut.fetch.single_string_header")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
        val headers = polyOut.fetchInit.headers
        assertThat(headers).hasSize(1)
        assertThat(headers).containsEntry(key, value)
    }

    private fun canPassMultipleHeadersAsString() {
        val key1 = "key1"
        val value1 = "value1"
        val key2 = "key2"
        val value2 = "value2"
        setInputs(key1, value1, key2, value2)

        clickButton("comm.polyOut.fetch.multiple_string_headers")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyOut.fetchWasCalled).isTrue()
        val headers = polyOut.fetchInit.headers
        assertThat(headers).hasSize(2)
        assertThat(headers).containsEntry(key1, value1)
        assertThat(headers).containsEntry(key2, value2)
    }

    private fun canPassStaticResponseFromFetch() {
        val body = "body"
        setInputs(body)
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
        val status = 418
        setInputs("$status")
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
        val ok = true
        setInputs("$ok")
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
        val body = "example"
        setInputs(body)

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
        val quad = Quad.builder.newDefault().build()
        setInputs(quad)

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
        clearQuadCollection()
        val quad1 = Quad.builder.new()
            .withSubject(IRI("http://example.org/s1"))
            .withPredicate(IRI("http://example.org/p1"))
            .withObject(IRI("http://example.org/o1"))
            .withGraph(IRI("http://example.org/g1"))
            .build()
        addQuadToCollection(quad1)

        val quad2 = Quad.builder.new()
            .withSubject(IRI("http://example.org/s2"))
            .withPredicate(IRI("http://example.org/p2"))
            .withObject(IRI("http://example.org/o2"))
            .withGraph(IRI("http://example.org/g2"))
            .build()
        addQuadToCollection(quad2)

        clickButton("comm.polyIn.add.multiple_quads")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(2)
        assertThat(polyIn.addParams)
            .containsExactlyElementsIn(arrayOf(quad1, quad2))
    }

    private fun addSupportsQuadsWithIRISubject() {
        val quad = Quad.builder.newDefault()
            .withSubject(IRI("http://example.org/s"))
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_named_node_subject")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun addSupportsQuadsWithBlankNodeSubject() {
        val quad = Quad.builder.newDefault()
            .withSubject(BlankNode("subject"))
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_blank_node_subject")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun addSupportsQuadsWithIRIObject() {
        val quad = Quad.builder.newDefault()
            .withObject(IRI("http://example.org/o"))
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_named_node_object")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun addSupportsQuadsWithBlankNodeObject() {
        val quad = Quad.builder.newDefault()
            .withObject(BlankNode("object"))
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_blank_node_object")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun addSupportsQuadsWithLiteralObject() {
        val quad = Quad.builder.newDefault()
            .withObject(Literal("string"))
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_literal_object")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun addSupportsQuadsWithIRIGraph() {
        val quad = Quad.builder.newDefault()
            .withGraph(IRI("http://example.org/g"))
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_named_node_graph")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun addSupportsQuadsWithBlankNodeGraph() {
        val quad = Quad.builder.newDefault()
            .withGraph(BlankNode("graph"))
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_blank_node_graph")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun addSupportsQuadsWithDefaultGraph() {
        val quad = Quad.builder.newDefault()
            .withDefaultGraph()
            .build()
        setInputs(quad)

        clickButton("comm.polyIn.add.quad_with_default_graph")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.addWasCalled).isTrue()
        assertThat(polyIn.addParams).hasSize(1)
        assertThat(polyIn.addParams!![0]).isEqualTo(quad)
    }

    private fun canPassEmptyMatcherToPolyInMatch() {
        clickButton("comm.polyIn.match.pass_empty_matcher")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.matchWasCalled).isTrue()
        val matcher = polyIn.matchMatcher
        assertThat(matcher).isNotNull()
        assertThat(matcher!!.subject).isNull()
        assertThat(matcher.predicate).isNull()
        assertThat(matcher.`object`).isNull()
    }

    private fun canPassMatcherWithSubjectToPolyInMatch() {
        val subject = IRI("http://example.org/s")
        setInput(1, subject.iri)

        clickButton("comm.polyIn.match.pass_matcher_with_subject")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.matchWasCalled).isTrue()
        val matcher = polyIn.matchMatcher
        assertThat(matcher).isNotNull()
        assertThat(matcher!!.subject).isEqualTo(subject)
        assertThat(matcher.predicate).isNull()
        assertThat(matcher.`object`).isNull()
    }

    private fun canPassMatcherWithPredicateToPolyInMatch() {
        val predicate = IRI("http://example.org/p")
        setInput(1, predicate.iri)

        clickButton("comm.polyIn.match.pass_matcher_with_predicate")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.matchWasCalled).isTrue()
        val matcher = polyIn.matchMatcher
        assertThat(matcher).isNotNull()
        assertThat(matcher!!.subject).isNull()
        assertThat(matcher.predicate).isEqualTo(predicate)
        assertThat(matcher.`object`).isNull()
    }

    private fun canPassMatcherWithObjectToPolyInMatch() {
        val `object` = IRI("http://example.org/o")
        setInput(1, `object`.iri)

        clickButton("comm.polyIn.match.pass_matcher_with_object")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.matchWasCalled).isTrue()
        val matcher = polyIn.matchMatcher
        assertThat(matcher).isNotNull()
        assertThat(matcher!!.subject).isNull()
        assertThat(matcher.predicate).isNull()
        assertThat(matcher.`object`).isEqualTo(`object`)
    }

    private fun canPassMatcherWithAllThreeFieldsToPolyInMatch() {
        val subject = IRI("http://example.org/s")
        val predicate = IRI("http://example.org/p")
        val `object` = IRI("http://example.org/o")
        setInputs(subject.iri, predicate.iri, `object`.iri)

        clickButton("comm.polyIn.match.pass_matcher_with_all_three_fields")

        waitUntil({
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
        assertThat(polyIn.matchWasCalled).isTrue()
        val matcher = polyIn.matchMatcher
        assertThat(matcher).isNotNull()
        assertThat(matcher!!.subject).isEqualTo(subject)
        assertThat(matcher.predicate).isEqualTo(predicate)
        assertThat(matcher.`object`).isEqualTo(`object`)
    }

    private fun canGetEmptyArrayFromPolyInMatch() {
        polyIn.matchReturn = emptyList()

        clickButton("comm.polyIn.match.get_empty_array")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
        })
    }

    private fun canGetArrayWithSingleQuadFromPolyInMatch() {
        val quad = Quad.builder.newDefault().build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        clickButton("comm.polyIn.match.get_array_with_single_quad")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithIRISubjectFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withSubject(IRI("http://example.com/s"))
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        /* ktlint-disable max-line-length */
        clickButton("comm.polyIn.match.get_array_with_single_quad_with_named_node_subject")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithBlankNodeSubjectFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withSubject(BlankNode("subject"))
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        /* ktlint-disable max-line-length */
        clickButton("comm.polyIn.match.get_array_with_single_quad_with_blank_node_subject")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithIRIObjectFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withObject(IRI("http://example.com/o"))
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        clickButton("comm.polyIn.match.get_array_with_single_quad_with_named_node_object")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithBlankNodeObjectFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withObject(BlankNode("object"))
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        clickButton("comm.polyIn.match.get_array_with_single_quad_with_blank_node_object")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithLiteralObjectFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withObject(Literal("string"))
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        clickButton("comm.polyIn.match.get_array_with_single_quad_with_literal_object")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithIRIGraphFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withGraph(IRI("http://example.com/g"))
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        clickButton("comm.polyIn.match.get_array_with_single_quad_with_named_node_graph")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithBlankNodeGraphFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withGraph(BlankNode("graph"))
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        clickButton("comm.polyIn.match.get_array_with_single_quad_with_blank_node_graph")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithSingleQuadWithDefaultGraphFromPolyInMatch() {
        val quad = Quad.builder.newDefault()
            .withDefaultGraph()
            .build()
        polyIn.matchReturn = listOf(quad)
        addQuadToCollection(quad)

        clickButton("comm.polyIn.match.get_array_with_single_quad_with_default_graph")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    private fun canGetArrayWithMultipleQuadsFromPolyInMatch() {
        val quad1 = Quad.builder.new()
            .withSubject(IRI("subject1"))
            .withPredicate(IRI("predicate1"))
            .withObject(IRI("object1"))
            .withGraph(IRI("graph1"))
            .build()
        val quad2 = Quad.builder.new()
            .withSubject(IRI("subject2"))
            .withPredicate(IRI("predicate2"))
            .withObject(IRI("object2"))
            .withGraph(IRI("graph2"))
            .build()
        polyIn.matchReturn = listOf(quad1, quad2)
        addQuadToCollection(quad1)
        addQuadToCollection(quad2)

        clickButton("comm.polyIn.match.get_array_with_multiple_quads")

        waitUntil({
            assertThat(polyIn.matchWasCalled).isTrue()
            onFeature()
                .withElement(findElement(Locator.ID, "status"))
                .check(webMatches(getText(), `is`("All OK")))
            // actual assertion on JavaScript side
        })
    }

    // test functions above, helper function below

    private fun launchTestFeature(): PodApiTestDouble {
        var podApi: PodApiTestDouble? = null
        val fragmentArgs = Bundle().apply {
            putString("featureName", "testFeature")
            putString("featureFile", "test.zip")
        }
        val fragmentScenario = launchFragmentInContainer<FeatureFragmentTestDouble>(
            fragmentArgs, R.style.Theme_AppCompat
        )
        fragmentScenario.onFragment { fragment ->
            val webView = fragment.retrieveWebView()
            val polyOut = PolyOutTestDouble(
                ApplicationProvider.getApplicationContext()
            )
            val polyIn = PolyInTestDouble()
            podApi = PodApiTestDouble(polyOut, polyIn, webView)!!
            fragment.overridePodApi(podApi!!)
        }
        return podApi!!
    }

    private fun execute(test: () -> Unit) {
        podApi.reset()
        clearQuadCollection()
        test()
    }

    private fun onFeature() =
        onWebView()
            .inWindow(selectFrameByIdOrName("harness"))

    private fun clearQuadCollection() {
        clickButton("comm.polyIn.clear_quad_collection")
    }

    private fun addQuadToCollection(quad: Quad) {
        setInputs(quad)
        clickButton("comm.polyIn.add_quad_to_collection")
    }

    private fun setInputs(val1: String) {
        setInput(1, val1)
    }

    private fun setInputs(val1: String, val2: String) {
        setInput(1, val1)
        setInput(2, val2)
    }

    private fun setInputs(val1: String, val2: String, val3: String) {
        setInput(1, val1)
        setInput(2, val2)
        setInput(3, val3)
    }

    private fun setInputs(
        val1: String,
        val2: String,
        val3: String,
        val4: String
    ) {
        setInput(1, val1)
        setInput(2, val2)
        setInput(3, val3)
        setInput(4, val4)
    }

    private fun setInputs(quad: Quad) {
        setInput(1, quad.subject.asString())
        setInput(2, quad.predicate.iri)
        setInput(3, quad.`object`.asString())
        setInput(4, quad.graph.asString())
    }

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

    private fun waitUntil(function: () -> Unit, timeout: Long = 5000) {
        // TODO - is there a better way?
        var lastError: AssertionError? = null
        val until = Date(Date().time + timeout)
        while (Date().before(until)) {
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

fun QuadBuilder.Companion.newDefault(): QuadBuilder {
    return QuadBuilder()
        .withSubject(IRI("http://example.org/s"))
        .withPredicate(IRI("http://example.org/p"))
        .withObject(IRI("http://example.org/o"))
        .withGraph(IRI("http://example.org/g"))
}

fun QuadSubject.asString(): String {
    return when (this) {
        is IRISubject -> subject.iri
        is BlankNodeSubject -> subject.value
    }
}

fun QuadObject.asString(): String {
    return when (this) {
        is IRIObject -> `object`.iri
        is BlankNodeObject -> `object`.value
        is LiteralObject -> `object`.value
    }
}

fun QuadGraph.asString(): String {
    return when (this) {
        is IRIGraph -> graph.iri
        is BlankNodeGraph -> graph.value
        DefaultGraph -> ""
    }
}
*/
