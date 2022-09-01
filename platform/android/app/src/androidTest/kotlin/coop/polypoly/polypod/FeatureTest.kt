package coop.polypoly.polypod

import androidx.preference.PreferenceManager
import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import coop.polypoly.core.FeatureCategoryId
import coop.polypoly.polypod.core.UpdateNotification
import coop.polypoly.polypod.features.FeatureStorage
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

// TODO: Eliminate duplication with other test classes

@RunWith(AndroidJUnit4::class)
class FeatureTest {
    // TODO: Needed?
    private var activityScenario: ActivityScenario<MainActivity>? = null

    @Before
    fun preparePreferences() {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        PreferenceManager.getDefaultSharedPreferences(context)
            .edit().clear().commit()
        Preferences.setFirstRun(context, false)
        Preferences.setSecurityDoNotAskAgainCheck(context, true)
        // TODO: Necessary?
        UpdateNotification.mockData.id = 0
        FeatureStorage.forceShowCategories = listOf(FeatureCategoryId.developer)
    }

    @Test
    fun runAllTestFeatureTests() {
        activityScenario = ActivityScenario.launch(MainActivity::class.java)
        // TODO: Make this work
        Thread.sleep(5000)
        onView(withText("Test")).check(matches(isDisplayed()))
        Thread.sleep(5000)
    }
}
