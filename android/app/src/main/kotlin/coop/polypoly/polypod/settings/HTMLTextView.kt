package coop.polypoly.polypod.settings

import android.content.Context
import android.text.method.LinkMovementMethod
import android.util.AttributeSet
import androidx.core.text.HtmlCompat

class HTMLTextView(context: Context, attrs: AttributeSet) :
    androidx.appcompat.widget.AppCompatTextView(context, attrs) {
    init {
        text = HtmlCompat.fromHtml(
            text.toString(),
            HtmlCompat.FROM_HTML_MODE_LEGACY
        )
        movementMethod = LinkMovementMethod.getInstance()
    }
}
