package coop.polypoly.polypod.updatenotification

import android.content.Context
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
    private val context: Context = ApplicationProvider.getApplicationContext()

    @Test
    fun `notification with id = 0 considered seen`() {
        UpdateNotification.mockData.id = 0
        val notification = UpdateNotification(context)
        assertThat(notification.shouldShowInAppNotification()).isFalse()
        assertThat(notification.shouldShowPushNotification()).isFalse()
    }

    @Test
    fun `first ever notification considered not seen`() {
        UpdateNotification.mockData.id = 1
        val notification = UpdateNotification(context)
        assertThat(notification.shouldShowInAppNotification()).isTrue()
        assertThat(notification.shouldShowPushNotification()).isTrue()
    }

    @Test
    fun `previously shown notification considered seen`() {
        UpdateNotification.mockData.id = 1
        val notification = UpdateNotification(context)
        notification.onInAppNotificationSeen()
        notification.onPushNotificationSeen()
        assertThat(notification.shouldShowInAppNotification()).isFalse()
        assertThat(notification.shouldShowPushNotification()).isFalse()
    }

    @Test
    fun `additional notification with different id considered not seen`() {
        UpdateNotification.mockData.id = 1
        var notification = UpdateNotification(context)
        notification.onInAppNotificationSeen()
        notification.onPushNotificationSeen()

        UpdateNotification.mockData.id = 2
        notification = UpdateNotification(context)
        assertThat(notification.shouldShowInAppNotification()).isTrue()
        assertThat(notification.shouldShowPushNotification()).isTrue()
    }

    @Test
    fun `additional notification with lower id considered not seen`() {
        UpdateNotification.mockData.id = 2
        var notification = UpdateNotification(context)
        notification.onInAppNotificationSeen()
        notification.onPushNotificationSeen()

        UpdateNotification.mockData.id = 1
        notification = UpdateNotification(context)
        assertThat(notification.shouldShowInAppNotification()).isTrue()
        assertThat(notification.shouldShowPushNotification()).isTrue()
    }
}
