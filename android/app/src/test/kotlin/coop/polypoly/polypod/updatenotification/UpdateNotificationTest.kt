package coop.polypoly.polypod.updatenotification

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class UpdateNotificationTest {
    @Test
    fun `notification with id = 0 considered seen`() {
        val notification = loadNotification(0)
        assertThat(notification.shouldShowInAppNotification()).isFalse()
        assertThat(notification.shouldShowPushNotification()).isFalse()
    }

    @Test
    fun `first ever notification considered not seen`() {
        val notification = loadNotification(1)
        assertThat(notification.shouldShowInAppNotification()).isTrue()
        assertThat(notification.shouldShowPushNotification()).isTrue()
    }

    @Test
    fun `previously shown notification considered seen`() {
        val notification = loadNotification(1)
        notification.onInAppNotificationSeen()

        val secondNotification = loadNotification(1)
        assertThat(secondNotification.shouldShowInAppNotification()).isFalse()
        assertThat(secondNotification.shouldShowPushNotification()).isFalse()
    }

    @Test
    fun `additional notification with different id considered not seen`() {
        val notification = loadNotification(1)
        notification.onInAppNotificationSeen()

        val secondNotification = loadNotification(2)
        assertThat(secondNotification.shouldShowInAppNotification()).isTrue()
        assertThat(secondNotification.shouldShowPushNotification()).isTrue()
    }

    @Test
    fun `additional notification with lower id considered not seen`() {
        val notification = loadNotification(2)
        notification.onInAppNotificationSeen()
        notification.onPushNotificationSeen()

        val secondNotification = loadNotification(1)
        assertThat(secondNotification.shouldShowInAppNotification()).isTrue()
        assertThat(secondNotification.shouldShowPushNotification()).isTrue()
    }

    @Test
    fun `push notification considered seen after startup`() {
        val notification = loadNotification(1)
        notification.onStartup()
        assertThat(notification.shouldShowPushNotification()).isFalse()
    }

    @Test
    fun `in app notification considered not seen after push was seen`() {
        val notification = loadNotification(1)
        notification.onPushNotificationSeen()
        assertThat(notification.shouldShowPushNotification()).isFalse()
        assertThat(notification.shouldShowInAppNotification()).isTrue()
    }

    @Test
    fun `every notification considered seen on first run`() {
        val notification = loadNotification(1)
        notification.onFirstRun()
        assertThat(notification.shouldShowPushNotification()).isFalse()
        assertThat(notification.shouldShowInAppNotification()).isFalse()
    }

    private fun loadNotification(id: Int): UpdateNotification {
        UpdateNotification.mockData.id = id
        return UpdateNotification(ApplicationProvider.getApplicationContext())
    }
}
