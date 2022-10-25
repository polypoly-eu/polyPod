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
            onView(withText(R.string.button_update_notification_close))
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
        Preferences.setSecurityDoNotAskAgainCheck(context, true)
        Preferences.setClearCorePreferences(context, true)
    }

    @After
    fun closeActivity() {
        activityScenario?.close()
        activityScenario = null
    }

    @Test
    fun ignoredNotification() {
        relaunchActivity(0)
        InAppNotification.checkNotShown()
    }

    @Test
    fun firstNotificationShown() {
        relaunchActivity(1)
        InAppNotification.checkShown()
    }

    @Test
    fun notificationShownOnlyOnce() {
        relaunchActivity(1)
        InAppNotification.checkShown()
        InAppNotification.close()
        relaunchActivity(1)
        InAppNotification.checkNotShown()
    }

    @Test
    fun notificationShownAgainIfNotClosed() {
        relaunchActivity(1)
        InAppNotification.checkShown()
        relaunchActivity(1)
        InAppNotification.checkShown()
    }

    @Test
    fun notificationWithDifferentIdShown() {
        relaunchActivity(1)
        InAppNotification.checkShown()
        InAppNotification.close()
        relaunchActivity(2)
        InAppNotification.checkShown()
    }

    @Test
    fun seenLastNotificationMigrated() {
        setLastNotificationPreference(1, "ALL_SEEN")
        relaunchActivity(1)
        InAppNotification.checkNotShown()
    }

    @Test
    fun partlySeenLastNotificationMigrated() {
        setLastNotificationPreference(1, "PUSH_SEEN")
        relaunchActivity(1)
        InAppNotification.checkShown()
    }

    @Test
    fun unseenLastNotificationMigrated() {
        setLastNotificationPreference(1, "NOT_SEEN")
        relaunchActivity(1)
        InAppNotification.checkShown()
    }

    // TODO: Add tests that verify that the push notification shows up as
    //       expected. That should be possible with UiAutomator.

    private fun relaunchActivity(notificationId: Int) {
        closeActivity()
        UpdateNotificationData.mockData.id = notificationId
        activityScenario = ActivityScenario.launch(MainActivity::class.java)
    }

    private fun setLastNotificationPreference(id: Int, state: String) {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        val prefs =
            PreferenceManager.getDefaultSharedPreferences(context).edit()
        prefs.putInt("lastNotificationId", id)
        prefs.putString("lastNotificationState", state)
        prefs.commit()
    }
}
