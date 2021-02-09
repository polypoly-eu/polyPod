package coop.polypoly.polypod

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.polypod.features.FeatureStorage

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FeatureStorage().installBundledFeatures(applicationContext)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))
    }
}
