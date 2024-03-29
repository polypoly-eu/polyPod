package coop.polypoly.polypod

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.TaskStackBuilder
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import coop.polypoly.core.UpdateNotification

private const val CHANNEL_ID = "coop.polypoly.polypod.update"
private const val CHANNEL_NAME = "polyPod updates"

class PushNotificationWorker(
    appContext: Context,
    workerParams: WorkerParameters
) :
    Worker(appContext, workerParams) {
    private val context = appContext

    override fun doWork(): Result {
        if (!UpdateNotification.showPush)
            return Result.success()
        UpdateNotification.handlePushSeen()
        showPushNotification()
        return Result.success()
    }

    private fun showPushNotification() {
        val data = UpdateNotificationData(context)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val notificationManager =
                context.getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }

        val mainIntent = Intent(context, MainActivity::class.java)
        val mainPendingIntent = TaskStackBuilder.create(context).run {
            addNextIntentWithParentStack(mainIntent)
            getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT)
        }

        val pushNotification =
            NotificationCompat.Builder(context, CHANNEL_ID)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setSmallIcon(R.drawable.ic_notification)
                .setAutoCancel(true)
                .setContentTitle(data.title)
                .setContentText(data.text)
                .setStyle(
                    NotificationCompat.BigTextStyle().bigText(data.text)
                )
                .setContentIntent(mainPendingIntent)
                .build()

        NotificationManagerCompat.from(context)
            .notify(data.id, pushNotification)
    }
}
