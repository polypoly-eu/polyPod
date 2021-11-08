package coop.polypoly.polypod.updatenotification

import android.content.Context
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.R

class UpdateNotification(private val context: Context) {
    companion object {
        data class MockData(var id: Int? = null)
        val mockData = MockData()
    }

    private enum class State {
        NOT_SEEN,
        PUSH_SEEN,
        ALL_SEEN;

        companion object {
            fun parse(s: String?) =
                s.let { name -> values().firstOrNull { it.name == name } }
        }
    }

    val id = mockData.id
        ?: context.resources.getInteger(R.integer.update_notification_id)

    val title = context.getString(R.string.update_notification_title)

    val text = context.getString(R.string.update_notification_text)

    val pushDelay =
        context.resources.getInteger(R.integer.update_notification_push_delay)

    val showPush: Boolean
        get() = state == State.NOT_SEEN

    val showInApp: Boolean
        get() = state != State.ALL_SEEN

    private var state: State = loadLastState()
        set(value) {
            field = value
            Preferences.setLastNotification(context, id, state.name)
        }

    private fun loadLastState(): State {
        val (lastId, lastState) = Preferences.getLastNotification(context)
        return when {
            id == 0 -> State.ALL_SEEN
            id < lastId -> State.ALL_SEEN
            id == lastId -> State.parse(lastState) ?: State.ALL_SEEN
            else -> State.NOT_SEEN
        }
    }

    fun onStartup() = onPushSeen()

    fun onFirstRun() = onInAppSeen()

    fun onPushSeen() {
        if (state == State.NOT_SEEN)
            state = State.PUSH_SEEN
    }

    fun onInAppSeen() {
        state = State.ALL_SEEN
    }
}
