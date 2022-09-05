package coop.polypoly.polypod

import android.content.Context
import androidx.compose.ui.test.SemanticsNodeInteraction
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithTag
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.performClick
import androidx.preference.PreferenceManager
import androidx.test.core.app.ActivityScenario
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.matcher.RootMatchers.isDialog
import androidx.test.espresso.matcher.ViewMatchers.withClassName
import androidx.test.espresso.matcher.ViewMatchers.withContentDescription
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.hamcrest.Matchers.endsWith
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class FeatureSmokeTest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule(MainActivity::class.java)

//    private var activityScenario: ActivityScenario<MainActivity>? = null
//    private var context: Context? = null
//
//    @Before
//    fun preparePreferences() {
//        context = InstrumentationRegistry.getInstrumentation().targetContext
//        PreferenceManager.getDefaultSharedPreferences(context!!)
//            .edit().clear().commit()
//        Preferences.setSecurityDoNotAskAgainCheck(context!!, true)
//        Preferences.setFirstRun(context!!, false)
//        activityScenario = ActivityScenario.launch(MainActivity::class.java)
//    }
//
//    @After
//    fun closeActivity() {
//        activityScenario?.close()
//        activityScenario = null
//    }

    @Test
    fun onboardingShownOnFirstRun() {
        Thread.sleep(1000)
        val nodeInteractionCollection = composeTestRule.onAllNodesWithTag("Tile") // ktlint-disable max-line-length
        val nodeCount = nodeInteractionCollection.fetchSemanticsNodes().count()

        nodeInteractionCollection.run {
            for (i in 0 until nodeCount) {
                this[i].performClick()
                Thread.sleep(1000)
            }
        }
        Thread.sleep(1000)
    }
}
