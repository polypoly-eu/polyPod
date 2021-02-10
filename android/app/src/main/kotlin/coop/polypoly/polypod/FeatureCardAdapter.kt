package coop.polypoly.polypod

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment.findNavController
import androidx.recyclerview.widget.RecyclerView

class FeatureCardAdapter(private val originatingFragment: Fragment, private val features: List<String>) : RecyclerView.Adapter<FeatureCardAdapter.ViewHolder>() {

    class ViewHolder(val featureCardView: CardView) : RecyclerView.ViewHolder(featureCardView)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val featureCardView = LayoutInflater.from(parent.context)
            .inflate(R.layout.feature_card, parent, false) as CardView
        return ViewHolder(featureCardView)
    }

    override fun getItemCount() = features.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val featureNameView = holder.featureCardView.findViewById(R.id.feature_name) as TextView
        featureNameView.text = features[position]
        holder.featureCardView.setOnClickListener {
            // FIXME - navigation assumes we're coming from FirstFragment, which might not necessary be true
            val action =
                FeatureListFragmentDirections.actionFeatureListFragmentToFeatureFragment(
                    features[position]
                )
            findNavController(originatingFragment).navigate(action)
        }
    }
}
