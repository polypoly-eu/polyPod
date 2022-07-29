package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.core.Core
import coop.polypoly.core.CoreExceptionCode
import coop.polypoly.core.CoreFailure
import coop.polypoly.polypod.core.UpdateNotification
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.logging.LoggerFactory

@ExperimentalUnsignedTypes
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
                if (it.code == CoreExceptionCode.CoreAlreadyBootstrapped) {
                    return
                }
            }
            throw ex
        }

        FeatureStorage.importFeatures(this)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))
    }

    override fun onResume() {
        super.onResume()

        val notification = UpdateNotification(this)
        notification.handleStartup()

        val firstRun = Preferences.isFirstRun(this)
        if (firstRun) {
            notification.handleFirstRun()
        }

        val shouldShowAuthOnboarding = firstRun ||
            Authentication.shouldShowAuthOnboarding(this)

        if (!onboardingShown && shouldShowAuthOnboarding) {
            onboardingShown = true
            startActivity(Intent(this, OnboardingActivity::class.java))
        } else if (Authentication.canAuthenticate(this)) {
            startActivity(Intent(this, PodUnlockActivity::class.java))
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
