package coop.polypoly.polypod

import androidx.compose.ui.test.junit4.AndroidComposeTestRule
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import androidx.preference.PreferenceManager
import androidx.test.espresso.web.sugar.Web.onWebView
import androidx.test.espresso.web.webdriver.DriverAtoms.* // ktlint-disable no-wildcard-imports
import androidx.test.espresso.web.webdriver.Locator
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import coop.polypoly.core.FeatureCategoryId
import coop.polypoly.polypod.core.UpdateNotification
import coop.polypoly.polypod.features.FeatureStorage
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class FeatureTest {
    @get:Rule
    val composeTestRule = createMainActivityComposeRule()

    // TODO: Consider alternatives - at least a static function
    private fun createMainActivityComposeRule(): AndroidComposeTestRule<ActivityScenarioRule<MainActivity>, MainActivity> { // ktlint-disable max-line-length
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        PreferenceManager.getDefaultSharedPreferences(context)
            .edit().clear().commit()
        Preferences.setFirstRun(context, false)
        Preferences.setSecurityDoNotAskAgainCheck(context, true)
        UpdateNotification.mockData.id = 0
        FeatureStorage.forceShowCategories = listOf(FeatureCategoryId.developer)
        return createAndroidComposeRule()
    }

    @Test
    fun runAllTestFeatureTests() {
        composeTestRule.onNodeWithText("Test").run {
            performScrollTo()
            performClick()
        }
        // TODO: Get rid of all these sleeps
        Thread.sleep(1000)
        onFeature()
            .withElement(findElement(Locator.ID, "runAll"))
            .perform(webClick())
        Thread.sleep(1000)
        // TODO: Custom failure message
        onFeature().withElement(
            findElement(
                Locator.XPATH,
                "//span[text()='All OK']"
            )
        )
        Thread.sleep(1000)
    }

    private fun onFeature() = onWebView().inWindow(selectFrameByIndex(0))
}
