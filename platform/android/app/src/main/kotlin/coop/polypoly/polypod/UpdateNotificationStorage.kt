package coop.polypoly.polypod

import android.content.Context
import coop.polypoly.core.UpdateNotification

// TODO:
//val title = context.getString(R.string.update_notification_title)
//val text = context.getString(R.string.update_notification_text)
//val pushDelay =
//    context.resources.getInteger(R.integer.update_notification_push_delay)

class UpdateNotificationStorage(private val context: Context) :
    UpdateNotification.Storage {
    companion object {
        data class MockData(var id: Int? = null)

        val mockData = MockData()
    }

    val title = context.resources.getString(R.string.update_notification_title)
    val text = context.resources.getString(R.string.update_notification_text)
    val pushDelay =
        context.resources.getInteger(R.integer.update_notification_push_delay)

    override fun readId(): Int {
        return mockData?.id
            ?: context.resources.getInteger(R.integer.update_notification_id)
    }

    override fun writeLast(id: Int, name: String) {
        Preferences.setLastNotification(context, id, name)
    }

    override fun readLastId(): Int? {
        val (lastId, _) = Preferences.getLastNotification(context)
        return lastId
    }

    override fun readLastState(): String? {
        val (_, lastState) = Preferences.getLastNotification(context)
        return lastState
    }
}
