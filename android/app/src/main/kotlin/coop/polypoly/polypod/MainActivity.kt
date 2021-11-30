package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.updatenotification.UpdateNotification

class MainActivity : AppCompatActivity() {

    private var onboardingShown = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Authentication.authenticate(this) { success ->
            if (success) {
                FeatureStorage().installBundledFeatures(this)
                setContentView(R.layout.activity_main)
                setSupportActionBar(findViewById(R.id.toolbar))
            } else {
                // Since we do not have a dedicated unlocking activity yet,
                // we simply keep restarting the activity until unlocking
                // succeeds.
                recreate()
            }
        }
    }

    override fun onResume() {
        super.onResume()

        val notification = UpdateNotification(this)
        notification.handleStartup()

        val firstRun = Preferences.isFirstRun(this)
        if (firstRun) {
            notification.handleFirstRun()
        }

        val shouldShowOnboarding =
            firstRun || Authentication.shouldShowBiometricsPrompt(this)
        if (!onboardingShown && shouldShowOnboarding) {
            onboardingShown = true
            startActivity(
                Intent(
                    this,
                    OnboardingActivity::class.java
                )
            )
        }

        if (notification.showInApp) {
            AlertDialog.Builder(this)
                .setTitle(notification.title)
                .setMessage(notification.text)
                .setPositiveButton(
                    R.string.button_update_notification_close
                ) { _, _ ->
                    notification.handleInAppSeen()
                }
                .show()
        }
    }
}
