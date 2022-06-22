package coop.polypoly.polypod

import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.os.ParcelFileDescriptor
import java.io.File
import java.io.InputStream

class PDFBitmap {
    companion object {
        fun bitmapFromPDF(pdfInputStream: InputStream, densityDpi: Int): Bitmap {
            val tempPdf = File(kotlin.io.path.createTempFile().toString())
            pdfInputStream.use { input ->
                tempPdf.outputStream().use { output ->
                    input.copyTo(output)
                }
            }

            val fileDescriptor = ParcelFileDescriptor.open(
                tempPdf,
                ParcelFileDescriptor.MODE_READ_ONLY
            )
            val pdfRenderer = PdfRenderer(fileDescriptor)
            val page = pdfRenderer.openPage(0)

            // Create the bitmap to host the actual image.
            // Scales the image to device screen dpi.
            // Value of 72 corresponds to `render` docs:
            // "transform the content from page coordinates which are in points
            //  (1/72") to bitmap coordinates which are in pixels"
            val bitmap = Bitmap.createBitmap(
                densityDpi * page.width / 72,
                densityDpi * page.height / 72,
                Bitmap.Config.ARGB_8888)
            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)

            page.close()
            pdfRenderer.close()

            return bitmap
        }
    }
}
