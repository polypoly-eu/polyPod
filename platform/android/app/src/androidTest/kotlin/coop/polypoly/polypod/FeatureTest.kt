package coop.polypoly.polypod

import androidx.compose.ui.test.junit4.AndroidComposeTestRule
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import androidx.preference.PreferenceManager
import androidx.test.espresso.web.sugar.Web.onWebView
import androidx.test.espresso.web.webdriver.DriverAtoms
import androidx.test.espresso.web.webdriver.Locator
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import coop.polypoly.core.FeatureCategoryId
import coop.polypoly.polypod.features.FeatureStorage
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private typealias MainTestRule =
    AndroidComposeTestRule<ActivityScenarioRule<MainActivity>, MainActivity>

private fun onFeature() =
    onWebView().inWindow(DriverAtoms.selectFrameByIndex(0))

private fun waitFor(timeout: Long, f: () -> Unit) {
    val interval = 100L
    val startTime = System.currentTimeMillis()
    while (true) {
        Thread.sleep(interval)
        try {
            f()
            break
        } catch (e: Exception) {
            if (System.currentTimeMillis() - startTime > timeout)
                throw RuntimeException("Timeout after ${timeout}ms", e)
        }
    }
}

@RunWith(AndroidJUnit4::class)
class FeatureTest {
    @get:Rule
    val composeTestRule: MainTestRule by lazy {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        PreferenceManager.getDefaultSharedPreferences(context).edit().clear()
            .commit()
        Preferences.setFirstRun(context, false)
        Preferences.setSecurityDoNotAskAgainCheck(context, true)
        UpdateNotificationData.mockData.id = 0
        FeatureStorage.forceShowCategories = listOf(FeatureCategoryId.developer)
        createAndroidComposeRule()
    }

    @Test
    fun runAllTestFeatureTests() {
        composeTestRule.onNodeWithText("Test").run {
            performScrollTo()
            performClick()
        }

        onFeature()
            .withElement(DriverAtoms.findElement(Locator.ID, "run-all"))
            .perform(DriverAtoms.webClick())

        val successStatus = "All OK"
        try {
            waitFor(10000) {
                onFeature().withElement(
                    DriverAtoms.findElement(
                        Locator.XPATH,
                        "//span[text()='$successStatus']"
                    )
                )
            }
        } catch (e: Exception) {
            throw RuntimeException("Status not '$successStatus'", e)
        }
    }
}
