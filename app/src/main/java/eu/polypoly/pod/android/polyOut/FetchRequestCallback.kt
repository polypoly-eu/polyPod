package eu.polypoly.pod.android.polyOut

import android.util.Log
import org.chromium.net.CronetException
import org.chromium.net.UrlRequest
import org.chromium.net.UrlRequest.Callback
import org.chromium.net.UrlResponseInfo
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.channels.Channels
import java.nio.channels.WritableByteChannel
import kotlin.coroutines.Continuation
import kotlin.coroutines.resume

private const val TAG = "MyUrlRequestCallback"

class FetchRequestCallback(private val cont: Continuation<String>) : Callback() {

    private val bytesReceived: ByteArrayOutputStream = ByteArrayOutputStream()
    private val receiveChannel: WritableByteChannel = Channels.newChannel(bytesReceived)

    override fun onResponseStarted(request: UrlRequest?, info: UrlResponseInfo?) {
        Log.d(TAG, "onResponseStarted method called.")
        val httpStatusCode = info?.httpStatusCode
        Log.d(TAG, "httpStatusCode: $httpStatusCode")
        request?.read(ByteBuffer.allocateDirect(102400))
    }

    override fun onReadCompleted(request: UrlRequest?, info: UrlResponseInfo?, byteBuffer: ByteBuffer?) {
        Log.d(TAG, "onReadCompleted method called.")
        byteBuffer?.flip();
        try {
            receiveChannel.write(byteBuffer);
        } catch (e: IOException) {
            Log.e(TAG, "IOException during ByteBuffer read. Details: ", e);
        }
        byteBuffer?.clear();
        request?.read(byteBuffer);
    }

    override fun onFailed(request: UrlRequest?, info: UrlResponseInfo?, error: CronetException?) {
        Log.e(TAG, "onFailed method called, exception : ${error?.message}")
    }

    override fun onSucceeded(request: UrlRequest?, info: UrlResponseInfo?) {
        Log.d(TAG, "onSucceeded method called.")
        val result = bytesReceived.toString()
        cont.resume(result)
    }

    override fun onRedirectReceived(request: UrlRequest?, info: UrlResponseInfo?, newLocationUrl: String?) {
        Log.d(TAG, "onRedirectReceived method called.")
        request?.followRedirect()
    }
}
