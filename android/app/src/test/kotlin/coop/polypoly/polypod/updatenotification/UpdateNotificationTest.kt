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
        val notification = UpdateNotification(context)
        notification.id = 0
        assertThat(notification.inAppNotificationSeen).isTrue()
        assertThat(notification.pushNotificationSeen).isTrue()
    }

    @Test
    fun `first ever notification considered not seen`() {
        val notification = UpdateNotification(context)
        notification.id = 1
        assertThat(notification.inAppNotificationSeen).isFalse()
        assertThat(notification.pushNotificationSeen).isFalse()
    }

    @Test
    fun `previously shown notification considered seen`() {
        val notification = UpdateNotification(context)
        notification.id = 1
        notification.markInAppNotificationSeen()
        notification.markPushNotificationSeen()
        assertThat(notification.inAppNotificationSeen).isTrue()
        assertThat(notification.pushNotificationSeen).isTrue()
    }

    @Test
    fun `additional notification with different id considered not seen`() {
        val notification = UpdateNotification(context)
        notification.id = 1
        notification.markInAppNotificationSeen()
        notification.markPushNotificationSeen()
        notification.id = 2
        assertThat(notification.inAppNotificationSeen).isFalse()
        assertThat(notification.pushNotificationSeen).isFalse()
    }

    @Test
    fun `additional notification with lower id considered not seen`() {
        val notification = UpdateNotification(context)
        notification.id = 2
        notification.markInAppNotificationSeen()
        notification.markPushNotificationSeen()
        notification.id = 1
        assertThat(notification.inAppNotificationSeen).isFalse()
        assertThat(notification.pushNotificationSeen).isFalse()
    }
}
