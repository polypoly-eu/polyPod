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
import coop.polypoly.polypod.core.UpdateNotification

private const val CHANNEL_ID = "coop.polypoly.polypod.update"
private const val CHANNEL_NAME = "polyPod updates"

class PushNotificationWorker(
    appContext: Context,
    workerParams: WorkerParameters
) :
    Worker(appContext, workerParams) {
    private val context = appContext

    override fun doWork(): Result {
        val notification = UpdateNotification(context)
        if (!notification.showPush)
            return Result.success()
        notification.handlePushSeen()
        showPushNotification(notification)
        return Result.success()
    }

    private fun showPushNotification(notification: UpdateNotification) {
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
                .setContentTitle(notification.title)
                .setContentText(notification.text)
                .setStyle(
                    NotificationCompat.BigTextStyle().bigText(notification.text)
                )
                .setContentIntent(mainPendingIntent)
                .build()

        NotificationManagerCompat.from(context)
            .notify(notification.id, pushNotification)
    }
}
