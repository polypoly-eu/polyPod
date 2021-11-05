package coop.polypoly.polypod

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
import coop.polypoly.polypod.updatenotification.UpdateNotification
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

private class InAppNotification {
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

        fun close() {
            onView(withText(R.string.button_acknowledge))
                .inRoot(isDialog())
                .check(matches(isDisplayed()))
                .perform(click())
        }
    }
}

@RunWith(AndroidJUnit4::class)
class UpdateNotificationTest {
    private var activityScenario: ActivityScenario<MainActivity>? = null

    @Before
    fun preparePreferences() {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        PreferenceManager.getDefaultSharedPreferences(context)
            .edit().clear().commit()
        Preferences.setFirstRun(context, false)
        Preferences.setBiometricCheck(context, false)
    }

    @After
    fun closeActivity() {
        activityScenario?.close()
        activityScenario = null
    }

    @Test
    fun ignoredNotification() {
        launchActivity(0)
        InAppNotification.checkNotShown()
    }

    @Test
    fun firstNotificationShown() {
        launchActivity(1)
        InAppNotification.checkShown()
    }

    @Test
    fun notificationShownOnlyOnce() {
        launchActivity(1)
        InAppNotification.checkShown()
        InAppNotification.close()
        launchActivity(1)
        InAppNotification.checkNotShown()
    }

    @Test
    fun notificationShownAgainIfNotClosed() {
        launchActivity(1)
        InAppNotification.checkShown()
        launchActivity(1)
        InAppNotification.checkShown()
    }

    @Test
    fun differentNotificationShown() {
        launchActivity(1)
        InAppNotification.checkShown()
        InAppNotification.close()
        launchActivity(2)
        InAppNotification.checkShown()
    }

    private fun launchActivity(notificationId: Int) {
        closeActivity()
        UpdateNotification.mockData.id = notificationId
        activityScenario = ActivityScenario.launch(MainActivity::class.java)
    }
}
