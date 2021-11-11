package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.updatenotification.UpdateNotification

class MainActivity : AppCompatActivity() {

    private var onboardingShown = false
    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        print("onActivityresult")
        super.onActivityResult(requestCode, resultCode, data)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FeatureStorage().installBundledFeatures(this)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))
    }

    override fun onResume() {
        super.onResume()

        val notification = UpdateNotification(this)
        notification.markPushNotificationSeen()

        if (Preferences.isFirstRun(this)) {
            notification.markInAppNotificationSeen()
        }

        if (!notification.inAppNotificationSeen) {
            AlertDialog.Builder(this)
                .setTitle(notification.title)
                .setMessage(notification.text)
                .setPositiveButton(
                    R.string.button_update_notification_close
                ) { _, _ ->
                    notification.markInAppNotificationSeen()
                }
                .show()
        }
        if (!onboardingShown) {
            onboardingShown = true
            startActivity(
                Intent(
                    this,
                    OnboardingActivity::class.java
                )
            )
        }
        return
    }
}
