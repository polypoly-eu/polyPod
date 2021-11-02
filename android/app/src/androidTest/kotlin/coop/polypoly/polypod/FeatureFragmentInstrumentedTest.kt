package coop.polypoly.polypod

import android.os.Bundle
import androidx.fragment.app.testing.FragmentScenario
import androidx.fragment.app.testing.launchFragmentInContainer
import androidx.test.core.app.ApplicationProvider
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.espresso.web.assertion.WebViewAssertions.webMatches
import androidx.test.espresso.web.sugar.Web.onWebView
import androidx.test.espresso.web.webdriver.DriverAtoms.findElement
import androidx.test.espresso.web.webdriver.DriverAtoms.getText
import androidx.test.espresso.web.webdriver.DriverAtoms.selectFrameByIdOrName
import androidx.test.espresso.web.webdriver.DriverAtoms.webClick
import androidx.test.espresso.web.webdriver.Locator
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import coop.polypoly.polypod.polyIn.PolyInTestDouble
import coop.polypoly.polypod.polyOut.PolyOutTestDouble
import org.hamcrest.CoreMatchers.`is`
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Idea - verify that a Feature can successfully start and get a correctly setup environment with PodApi available,
 * can get its WebView and can render there, JavaScript works, etc...
 * Verifying that PodApi works does _not_ belong here and has its own test suite.
 */
@RunWith(AndroidJUnit4::class)
@LargeTest
class FeatureFragmentInstrumentedTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    // TODO: Re-enable this test
    // @Test
    fun whenStartingTheApp_firstFragmentIsShown() {
        onView(
            withText("testFeature"))
            .check(matches(isDisplayed()))
    }

    // TODO: Re-enable this test
    // @Test
    fun canNavigateToFeatureFragment() {

        onView(withText("testFeature"))
            .perform(click())

        onView(withText("testFeature"))
            .check(doesNotExist()) // I'm not on the first fragment any more

        onFeature()
            .withElement(findElement(Locator.ID, "status"))
            .check(webMatches(getText(), `is`("Starting")))
    }

    @Test
    fun canFindTextInWebView() {
        launchTestFeature()
        onFeature()
            .withElement(findElement(Locator.ID, "status"))
            .check(webMatches(getText(), `is`("Starting")))
    }

    @Test
    fun basicJavaScriptOnFeatureSideWorks() {
        launchTestFeature()
        onFeature()
            .withElement(findElement(Locator.ID, "javascript.simple"))
            .perform(webClick())
        // wait to let the call get through
        Thread.sleep(1000)
        onFeature()
            .withElement(findElement(Locator.ID, "status"))
            .check(webMatches(getText(), `is`("All OK")))
    }

    @Test
    fun afterStartingAFeature_podObjectEventuallyResolves() {
        val fragmentScenario = launchTestFeature()
        // wait for the feature container to finish initializing itself
        Thread.sleep(2000)
        fragmentScenario.onFragment { fragment ->
            val webView = fragment.retrieveWebView()
            val polyOut = PolyOutTestDouble(
                ApplicationProvider.getApplicationContext()
            )
            val polyIn = PolyInTestDouble()
            val podApi = PodApiTestDouble(polyOut, polyIn, webView)
            fragment.overridePodApi(podApi)
        }
        onFeature()
            .withElement(findElement(Locator.ID, "podApi.resolves"))
            .perform(webClick())
        // wait to let the call get through
        Thread.sleep(1000)
        onFeature()
            .withElement(findElement(Locator.ID, "status"))
            .check(webMatches(getText(), `is`("All OK")))
    }

    private fun launchTestFeature():
        FragmentScenario<FeatureFragmentTestDouble> {
        val fragmentArgs = Bundle().apply {
            putString("featureName", "testFeature")
            putString("featureFile", "test.zip")
        }
        return launchFragmentInContainer<FeatureFragmentTestDouble>(
            fragmentArgs, R.style.Theme_AppCompat
        )
    }

    private fun onFeature() =
        onWebView()
            .inWindow(selectFrameByIdOrName("harness"))
}
