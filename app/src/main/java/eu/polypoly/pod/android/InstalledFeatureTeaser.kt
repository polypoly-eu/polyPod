package eu.polypoly.pod.android

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.recyclerview.widget.RecyclerView

class InstalledFeatureTeaser(private val installedFeatures: Array<String>) : RecyclerView.Adapter<InstalledFeatureTeaser.ViewHolder>() {

    class ViewHolder(val itemListView: ConstraintLayout) : RecyclerView.ViewHolder(itemListView)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemListView = LayoutInflater.from(parent.context)
            .inflate(R.layout.installed_feature_teaser, parent, false) as ConstraintLayout
        return ViewHolder(itemListView)
    }

    override fun getItemCount() = installedFeatures.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val textView = holder.itemListView.getViewById(R.id.textView) as TextView
        textView.text = installedFeatures[position]
    }
}
