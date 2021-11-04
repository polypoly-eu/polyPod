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
        ALL_SEEN;

        companion object {
            fun parse(s: String?) =
                s.let { s -> values().firstOrNull { it.name == s } }
        }
    }

    val id = mockData.id
        ?: context.resources.getInteger(R.integer.update_notification_id)
    val title = context.getString(R.string.update_notification_title)
    val text = context.getString(R.string.update_notification_text)
    val pushDelay =
        context.resources.getInteger(R.integer.update_notification_push_delay)

    private fun loadLastState(): State {
        val (lastId, lastState) = Preferences.getLastNotification(context)
        return when (id) {
            0 -> State.ALL_SEEN
            lastId -> State.parse(lastState) ?: State.ALL_SEEN
            else -> State.NOT_SEEN
        }
    }

    private var state: State = loadLastState()
        set(value) {
            field = value
            Preferences.setLastNotification(context, id, state.name)
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
