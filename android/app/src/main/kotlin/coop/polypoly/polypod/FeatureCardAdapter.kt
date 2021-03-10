package coop.polypoly.polypod

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import coop.polypoly.polypod.features.PartialFeature

class FeatureCardAdapter(private val originatingFragment: Fragment, private val features: List<PartialFeature>) : RecyclerView.Adapter<FeatureCardAdapter.ViewHolder>() {

    class ViewHolder(val featureCardView: View) : RecyclerView.ViewHolder(featureCardView)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val featureCardView = LayoutInflater.from(parent.context)
            .inflate(R.layout.feature_card, parent, false)
        return ViewHolder(featureCardView)
    }

    override fun getItemCount() = features.size

    private fun updateThumbnail(view: View, feature: PartialFeature) {
        val thumbnail = view.findViewById<ImageView>(R.id.thumbnail)
        thumbnail.setBackgroundColor(feature.primaryColor)
        // We cannot read images from the feature manifest yet, hence hard coded
        val thumbnailResourceId = mapOf(
            "polyExplorer" to R.drawable.thumbnail_polyexplorer,
            "polyPreview" to R.drawable.thumbnail_polypreview
        )[feature.name]
        if (thumbnailResourceId != null)
            thumbnail.setImageResource(thumbnailResourceId)
    }

    private fun updateTexts(view: View, feature: PartialFeature) {
        mapOf(R.id.feature_name to feature.name,
            R.id.feature_author to feature.author,
            R.id.feature_description to feature.description).forEach {
            (view.findViewById(it.key) as TextView).text = it.value
        }
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val view = holder.featureCardView
        val feature = features[position]
        updateThumbnail(view, feature)
        updateTexts(view, feature)
        view.setOnClickListener {
            // FIXME - navigation assumes we're coming from FirstFragment, which might not necessary be true
            val action =
                FeatureListFragmentDirections.actionFeatureListFragmentToFeatureFragment(feature.name)
            findNavController(originatingFragment).navigate(action)
        }
    }
}
