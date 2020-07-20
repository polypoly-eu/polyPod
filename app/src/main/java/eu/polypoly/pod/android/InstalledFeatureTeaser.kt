package eu.polypoly.pod.android

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class InstalledFeatureTeaser(private val installedFeatures: Array<String>) : RecyclerView.Adapter<InstalledFeatureTeaser.ViewHolder>() {

    class ViewHolder(val textView: TextView) : RecyclerView.ViewHolder(textView)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val textView = LayoutInflater.from(parent.context)
            .inflate(R.layout.installed_feature_teaser, parent, false) as TextView
        return ViewHolder(textView)
    }

    override fun getItemCount() = installedFeatures.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.textView.text = installedFeatures[position]
    }
}
