package coop.polypoly.core

class UpdateNotification() {
    interface Storage {
        fun readId(): Int
        fun writeLast(id: Int, state: String)
        fun readLastId(): Int?
        fun readLastState(): String?
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

    companion object {
        var storage: Storage? = null
    }

    val id = storage!!.readId()

    val showPush: Boolean
        get() = state == State.NOT_SEEN

    val showInApp: Boolean
        get() = state != State.ALL_SEEN

    private var state: State = loadLastState()
        set(value) {
            field = value
            storage!!.writeLast(id, state.name)
        }

    private fun loadLastState(): State {
        val lastId = storage!!.readLastId() ?: 0
        val lastState = storage!!.readLastState()
        return when {
            id == 0 -> State.ALL_SEEN
            id < lastId -> State.ALL_SEEN
            id == lastId -> State.parse(lastState) ?: State.ALL_SEEN
            else -> State.NOT_SEEN
        }
    }

    fun handleStartup() {
        if (state == State.NOT_SEEN)
            state = State.PUSH_SEEN
    }

    fun handleFirstRun() {
        state = State.ALL_SEEN
    }

    fun handlePushSeen() {
        if (state == State.NOT_SEEN)
            state = State.PUSH_SEEN
    }

    fun handleInAppSeen() {
        state = State.ALL_SEEN
    }
}
