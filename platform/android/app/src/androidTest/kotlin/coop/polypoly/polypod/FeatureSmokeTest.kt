package coop.polypoly.polypod

import androidx.compose.ui.test.SemanticsNodeInteraction
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithTag
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.doesNotExist
import androidx.test.espresso.matcher.ViewMatchers.withId
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class FeatureSmokeTest {

    @get:Rule
    val composeTestRule = createAndroidComposeRule(MainActivity::class.java)

    private fun nodeIsDisplayed(nodeInteraction: SemanticsNodeInteraction): Boolean { // ktlint-disable max-line-length
        return nodeInteraction.runCatching {
            nodeInteraction.assertIsDisplayed()
        }.isSuccess
    }

    private fun homeScreen(): SemanticsNodeInteraction {
        return composeTestRule.onNode(hasTestTag("HomeScreen"))
    }

    private fun pressCloseUntilHomeScreenIsDisplayed() {
        var retryCount = 0
        while (!nodeIsDisplayed(homeScreen()) && retryCount < 10) {
            retryCount += 1
            onView(withId(R.id.close_button)).perform(click())
            Thread.sleep(500)
        }
    }

    @Test
    fun openFeaturesAndCheckForErrorDialog() {
        Thread.sleep(1000)

        // Onboarding might show up. Close it.
        pressCloseUntilHomeScreenIsDisplayed()

        val nodeInteractionCollection = composeTestRule.onAllNodesWithTag(
            "Tile"
        )
        val nodeCount = nodeInteractionCollection.fetchSemanticsNodes().count()

        nodeInteractionCollection.run {
            for (i in 0 until nodeCount) {
                val nodeInter = this[i]
                nodeInter.performScrollTo()
                nodeInter.performClick()
                Thread.sleep(1000)
                onView(withId(android.R.id.message)).check(
                    doesNotExist()
                )
                pressCloseUntilHomeScreenIsDisplayed()
            }
        }
    }
}
