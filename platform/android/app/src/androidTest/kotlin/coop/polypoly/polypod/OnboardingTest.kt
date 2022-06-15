package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager
import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.RootMatchers.isDialog
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import coop.polypoly.polypod.core.UpdateNotification
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

private class OnboardingActivity {
    companion object {
        fun checkNotShown() {
            onView(withText(R.string.update_notification_title))
                .check(doesNotExist())
        }

        fun checkShown() {
            onView(withText(R.string.update_notification_title))
                .inRoot(isDialog())
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
        PreferenceManager.getDefaultSharedPreferences(context)
            .edit().clear().commit()
        Preferences.setBiometricCheck(context!!, false)
    }

    @After
    fun closeActivity() {
        activityScenario?.close()
        activityScenario = null
    }

    @Test
    fun onboardingShownOnFirstRun() {
        relaunchActivity(true)
        OnboardingActivity.checkShown()
    }

    @Test
    fun onboardingNotShownOnSubsequentRun() {
        relaunchActivity(false)
        OnboardingActivity.checkNotShown()
    }

    private fun relaunchActivity(firstRun: Boolean) {
        closeActivity()
        Preferences.setFirstRun(context!!, firstRun)
        activityScenario = ActivityScenario.launch(MainActivity::class.java)
    }
}
