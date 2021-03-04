package coop.polypoly.polypod

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.cardview.widget.CardView
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

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val feature = features[position]
        holder.featureCardView.findViewById<ImageView>(R.id.thumbnail).setBackgroundColor(Color.parseColor(feature.primaryColor))
        mapOf(R.id.feature_name to feature.name,
            R.id.feature_author to feature.author,
            R.id.feature_description to feature.description).forEach {
            (holder.featureCardView.findViewById(it.key) as TextView).text = it.value
        }
        holder.featureCardView.setOnClickListener {
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
