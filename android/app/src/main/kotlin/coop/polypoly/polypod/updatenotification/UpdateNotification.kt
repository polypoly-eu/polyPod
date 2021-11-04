package coop.polypoly.polypod.updatenotification

import android.content.Context
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.R

class UpdateNotification(private val context: Context) {
    data class MockData(var id: Int? = null)

    companion object {
        val mockData = MockData()
    }

    enum class State {
        NOT_SEEN,
        PUSH_SEEN,
        ALL_SEEN
    }

    val id = mockData.id
        ?: context.resources.getInteger(R.integer.update_notification_id)
    val title = context.getString(R.string.update_notification_title)
    val text = context.getString(R.string.update_notification_text)
    val pushDelay =
        context.resources.getInteger(R.integer.update_notification_push_delay)

    private var state: State = when (id) {
        0 -> State.ALL_SEEN
        Preferences.getSeenInAppNotificationId(context) -> State.ALL_SEEN
        Preferences.getSeenPushNotificationId(context) -> State.PUSH_SEEN
        else -> State.NOT_SEEN
    }
        set(value) {
            field = value
            if (value != State.NOT_SEEN)
                Preferences.setSeenPushNotificationId(context, id)
            if (value == State.ALL_SEEN)
                Preferences.setSeenInAppNotificationId(context, id)
        }

    fun onStartup() {
        if (state == State.NOT_SEEN)
            state = State.PUSH_SEEN
    }

    fun onFirstRun() {
        state = State.ALL_SEEN
    }

    fun onPushNotificationSeen() {
        if (state == State.NOT_SEEN)
            state = State.PUSH_SEEN
    }

    fun onInAppNotificationSeen() {
        state = State.ALL_SEEN
    }

    fun shouldShowPushNotification() = state == State.NOT_SEEN

    fun shouldShowInAppNotification() = state != State.ALL_SEEN
}
