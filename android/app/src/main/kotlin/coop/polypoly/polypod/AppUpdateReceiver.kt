package coop.polypoly.polypod

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.core.UpdateNotification
import java.util.concurrent.TimeUnit

class AppUpdateReceiver : BroadcastReceiver() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (context == null) {
            logger.error(
                "Failed to schedule push notification - invalid context"
            )
            return
        }
        val delay = UpdateNotification(context).pushDelay.toLong()
        val request =
            OneTimeWorkRequest.Builder(PushNotificationWorker::class.java)
                .setInitialDelay(delay, TimeUnit.SECONDS).build()
        WorkManager.getInstance(context).enqueue(request)
    }
}
