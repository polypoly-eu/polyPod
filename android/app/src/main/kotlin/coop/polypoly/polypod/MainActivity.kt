package coop.polypoly.polypod

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.polypod.features.FeatureStorage

class MainActivity : AppCompatActivity() {

    companion object {
        private var appContext: Context? = null
        fun getContext(): Context? {
            return appContext
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        appContext = getApplicationContext()
        FeatureStorage().installBundledFeatures(applicationContext)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))
    }

    override fun onResume() {
        super.onResume()
        if (Preferences.isFirstRun(baseContext))
            startActivity(Intent(this, OnboardingActivity::class.java))
    }
}
