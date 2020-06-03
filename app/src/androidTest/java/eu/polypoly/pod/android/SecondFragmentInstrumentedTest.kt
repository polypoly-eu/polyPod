package eu.polypoly.pod.android

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.rule.ActivityTestRule
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class SecondFragmentInstrumentedTest {

    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java)

    @Test
    fun firstFragmentIsShown() {
        onView(withText("Hello first fragment")).check(matches(isDisplayed()))
    }

    @Test
    fun canNavigateToSecondFragment() {
        onView(withText("Hello first fragment"))
            .check(matches(isDisplayed()))  // verify I'm starting on first view

        onView(withId(R.id.button_first))
            .perform(click())

        onView(withId(R.id.button_second))
            .check(matches(isDisplayed()))

        onView(withId(R.id.button_first))
            .check(doesNotExist())
    }
}
