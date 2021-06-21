package coop.polypoly.polypod

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Ignore
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.LooperMode

/**
 * This test should be on-par with SecondFragmentInstrumentedTest class.
 * The idea is to have ideally identical tests running both on emulator/device and in Robolectric environment.
 * It merely shows a technical possibility. In the end Robolectric is more meant to aid during unit testing whereas
 * instrumented tests are full-fledged integration tests. For example, as seen below, Robolectric doesn't seem to handle WebViews.
 */
@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
class FeatureFragmentTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    @Ignore(
        """
        This test assumes some state of the device and thus is failing often
        - find something more meaningful to test
        """
    )
    fun firstFragmentIsShown() {
        // FIXME - hardcoded feature name,
        // find some other useful element or another way of testing this
        onView(withText("testFeature"))
            .check(matches(isDisplayed()))
    }

    // Unfortunately, Robolectric doesn't seem to support WebView so
    // testing anything Feature related is not really possible.
}
