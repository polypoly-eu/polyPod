package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager
import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

private class Onboarding {
    companion object {
        fun checkNotShown() {
            onView(withText(R.string.onboarding_slide1_headline))
                .check(doesNotExist())
        }

        fun checkShown() {
            onView(withText(R.string.onboarding_slide1_headline))
                .check(matches(isDisplayed()))
        }
    }
}

@RunWith(AndroidJUnit4::class)
class OnboardingTest {
    private var activityScenario: ActivityScenario<MainActivity>? = null
    private var context: Context? = null

    @Before
    fun preparePreferences() {
        context = InstrumentationRegistry.getInstrumentation().targetContext
        PreferenceManager.getDefaultSharedPreferences(context!!)
            .edit().clear().commit()
        Preferences.setSecurityDoNotAskAgainCheck(context!!, true)
    }

    @After
    fun closeActivity() {
        activityScenario?.close()
        activityScenario = null
    }

    @Test
    fun onboardingShownOnFirstRun() {
        relaunchActivity(true)
        Onboarding.checkShown()
    }

    @Test
    fun onboardingNotShownOnSubsequentRun() {
        relaunchActivity(false)
        Onboarding.checkNotShown()
    }

    private fun relaunchActivity(firstRun: Boolean) {
        closeActivity()
        Preferences.setFirstRun(context!!, firstRun)
        activityScenario = ActivityScenario.launch(MainActivity::class.java)
    }
}
