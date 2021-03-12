package coop.polypoly.polypod

import android.content.Context
import android.util.AttributeSet
import androidx.core.content.res.ResourcesCompat

class AppBarButton(context: Context, attrs: AttributeSet?) :
    androidx.appcompat.widget.AppCompatImageButton(context, attrs) {
    init {
        background = ResourcesCompat.getDrawable(
            resources,
            R.drawable.app_bar_button_bg,
            context.theme
        )
    }
}
