package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.core.Core
import coop.polypoly.core.CoreFailure
import coop.polypoly.polypod.core.UpdateNotification
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.logging.LoggerFactory
import java.lang.Exception

class MainActivity : AppCompatActivity() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private var onboardingShown = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val language = Language.determine(this@MainActivity)
        try {
            Core.bootstrapCore(language)
            logger.info("Core is bootstrapped!")
        } catch (ex: Exception) {
            logger.info(ex.message)
            (ex as? CoreFailure)?.also {
                // Ignore CoreAlreadyBootstrapped error, as it is not breaking.
                if (it.code == 2) {
                    return
                }
            }
            throw ex
        }

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
