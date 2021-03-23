package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.updatenotification.UpdateNotification

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FeatureStorage().installBundledFeatures(applicationContext)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))
    }

    override fun onResume() {
        super.onResume()
        val notification = UpdateNotification(this)
        notification.markPushNotificationSeen()

        if (Preferences.isFirstRun(this)) {
            notification.markInAppNotificationSeen()
            startActivity(Intent(this, OnboardingActivity::class.java))
            return
        }

        if (!notification.inAppNotificationSeen) {
            AlertDialog.Builder(this)
                .setTitle(notification.title)
                .setMessage(notification.text)
                .setPositiveButton(R.string.button_update_notification_close) { _, _ ->
                    notification.markInAppNotificationSeen()
                }
                .show()
        }
    }
}
