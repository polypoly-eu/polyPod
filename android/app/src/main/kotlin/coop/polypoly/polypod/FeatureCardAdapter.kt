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
import coop.polypoly.polypod.features.Feature

class FeatureCardAdapter(private val originatingFragment: Fragment, private val features: List<Feature>) : RecyclerView.Adapter<FeatureCardAdapter.ViewHolder>() {

    class ViewHolder(val featureCardView: View) : RecyclerView.ViewHolder(featureCardView)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val featureCardView = LayoutInflater.from(parent.context)
            .inflate(R.layout.feature_card, parent, false)
        return ViewHolder(featureCardView)
    }

    override fun getItemCount() = features.size

    private fun updateThumbnail(view: View, feature: Feature) {
        val thumbnail = view.findViewById<ImageView>(R.id.thumbnail)
        // We cannot read images from the feature manifest yet, hence hard coded
        if (feature.name == "polyExplorer")
            thumbnail.setImageResource(R.drawable.thumbnail_polyexplorer)
        else
            thumbnail.setBackgroundColor(Color.parseColor(feature.primaryColor))
    }

    private fun updateTexts(view: View, feature: Feature) {
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
                FeatureListFragmentDirections.actionFeatureListFragmentToFeatureFragment(
                    feature.name,
                    feature.primaryColor
                )
            findNavController(originatingFragment).navigate(action)
        }
    }
}
