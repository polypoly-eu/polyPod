package coop.polypoly.polypod

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import coop.polypoly.core.BootstrapArgs
import coop.polypoly.core.Core
import coop.polypoly.core.CoreExceptionCode
import coop.polypoly.core.CoreFailure
import coop.polypoly.core.CoreRequest
import coop.polypoly.core.UpdateNotification
import coop.polypoly.core.fromValue
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.logging.LoggerFactory

@ExperimentalUnsignedTypes
class MainActivity : AppCompatActivity(), LifecycleEventObserver {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private var onboardingShown = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        initCore()

        ProcessLifecycleOwner.get().lifecycle.addObserver(this)

        FeatureStorage.importFeatures(this)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))

        Core.executeRequest(CoreRequest.HandleStartup())

        val firstRun = Preferences.isFirstRun(this)
        if (firstRun) {
            Core.executeRequest(CoreRequest.HandleFirstRun())
        }

        val shouldShowAuthOnboarding = firstRun ||
            Authentication.shouldShowAuthOnboarding(this)

        if (!onboardingShown && shouldShowAuthOnboarding) {
            onboardingShown = true
            startActivity(Intent(this, OnboardingActivity::class.java))
        } else if (Authentication.canAuthenticate(this)) {
            startActivity(Intent(this, PodUnlockActivity::class.java))
        }

        val notificationData = UpdateNotificationData(this)
        if (UpdateNotification.showInApp) {
            AlertDialog.Builder(this)
                .setTitle(notificationData.title)
                .setMessage(notificationData.text)
                .setPositiveButton(
                    R.string.button_update_notification_close
                ) { _, _ ->
                    UpdateNotification.handleInAppSeen()
                }
                .show()
        }
    }

    private fun initCore() {
        val language = Language.determine(this@MainActivity)
        val fsRoot = this@MainActivity.filesDir
        val notificationData = UpdateNotificationData(this)
        try {
            Core.bootstrapCore(
                BootstrapArgs(
                    language,
                    fsRoot.path,
                    notificationData.id
                )
            )
            logger.info("Core is bootstrapped!")
        } catch (ex: Exception) {
            logger.info(ex.message)
            // Ignore CoreAlreadyBootstrapped error, as it is not breaking.
            if ((ex as? CoreFailure)?.code
                != CoreExceptionCode.CoreAlreadyBootstrapped
            )
                throw ex
        }

        if (Preferences.getClearCorePreferences(this)) {
            logger.info("Clearing core preferences")
            Core.executeRequest(CoreRequest.ClearPreferences())
            Preferences.setClearCorePreferences(this, false)
        }

        Preferences.migrateToCore(this)
    }

    override fun onStateChanged(
        source: LifecycleOwner,
        event: Lifecycle.Event
    ) {
        when (event) {
            Lifecycle.Event.ON_STOP,
            Lifecycle.Event.ON_DESTROY ->
                Core.executeRequest(CoreRequest.HandleAppDidBecomeInactive())
            Lifecycle.Event.ON_RESUME -> {
                if (
                    Authentication.canAuthenticate(this) &&
                    Core.executeRequest(
                        CoreRequest.IsUserSessionExpired(),
                        Boolean::fromValue
                    )
                ) {
                    startActivity(
                        Intent(
                            this,
                            PodUnlockActivity::class.java
                        )
                    )
                }
            }
            else -> {}
        }
    }
}
