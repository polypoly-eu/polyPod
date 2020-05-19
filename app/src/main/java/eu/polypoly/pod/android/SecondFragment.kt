package eu.polypoly.pod.android

import android.content.res.AssetManager.ACCESS_BUFFER
import android.os.Bundle
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.stream.Collectors

/**
 * A simple [Fragment] subclass as the second destination in the navigation.
 */
class SecondFragment : Fragment() {

    private val args: SecondFragmentArgs by navArgs()

    override fun onCreateView(
            inflater: LayoutInflater, container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_second, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val myWebView: WebView = view.findViewById(R.id.web_view)
        myWebView.settings.javaScriptEnabled = true
        myWebView.addJavascriptInterface(PodApi(), "pod")

        val am = resources.assets
        val htmlReader = BufferedReader(InputStreamReader(am.open("index.html", ACCESS_BUFFER)))
        val html = htmlReader.lines().collect(Collectors.joining())
        val encodedHtml = Base64.encodeToString(html.toByteArray(), Base64.NO_PADDING)
        myWebView.loadData(encodedHtml, "text/html", "base64")

        view.findViewById<Button>(R.id.button_second).setOnClickListener {
            findNavController().navigate(R.id.action_SecondFragment_to_FirstFragment)
        }
    }
}
