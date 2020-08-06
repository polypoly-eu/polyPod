package eu.polypoly.pod.android

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule
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
    val activityRule = ActivityTestRule(MainActivity::class.java)

    @Test
    fun firstFragmentIsShown() {
        onView(withText("podCheck"))    // FIXME - hardcoded feature name, find some other useful element or another way of testing this
            .check(matches(isDisplayed()))
    }

    // Unfortunately, Robolectric doesn't seem to support WebView so testing anything Feature related is not really possible.
}
