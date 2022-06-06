package coop.polypoly.polypod.settings

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import coop.polypoly.polypod.R

class SettingsActivity : AppCompatActivity() {
    private lateinit var appBarConfig: AppBarConfiguration

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        val navHostFragment =
            supportFragmentManager.findFragmentById(
                R.id.settings_nav_host_fragment
            )
        navHostFragment?.findNavController()?.let {
            appBarConfig = AppBarConfiguration(it.graph)
            // This shows the back button on the main fragment as well
            (appBarConfig.topLevelDestinations as MutableSet<*>).clear()
            setupActionBarWithNavController(it, appBarConfig)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.settings_nav_host_fragment)
        if (!navController.navigateUp(appBarConfig))
            finish()
        return true
    }
}
