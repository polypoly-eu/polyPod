package coop.polypoly.polypod

import android.content.Context

class UpdateNotificationData(private val context: Context) {
    companion object {
        data class MockData(var id: Int? = null)

        val mockData = MockData()
    }

    val id: Int get() = mockData?.id
        ?: context.resources.getInteger(R.integer.update_notification_id)
    val title = context.resources.getString(R.string.update_notification_title)
    val text = context.resources.getString(R.string.update_notification_text)
    val pushDelay =
        context.resources.getInteger(R.integer.update_notification_push_delay)
}
