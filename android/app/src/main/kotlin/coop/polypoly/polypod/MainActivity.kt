package coop.polypoly.polypod

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import coop.polypoly.polypod.features.FeatureWallet

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FeatureWallet().installBundledFeatures(applicationContext)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))
    }
}
