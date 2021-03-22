package coop.polypoly.polypod.polyin

import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth
import coop.polypoly.polypod.polyIn.PolyIn
import coop.polypoly.polypod.polyIn.rdf.*
import eu.polypoly.bubblewrap.Codec
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.msgpack.value.ValueFactory
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class PolyInTest {
    val testScope = GlobalScope

    @Test
    fun storingStrings_works() {
        val polyIn = PolyIn("test_database.nt")
        polyIn.clean()

        var storageData: List<Quad>  = listOf()
        storageData = storageData.plus(QuadBuilder.new().withDefaultGraph()
            .withObject(BlankNode("privateData"))
            .withSubject(BlankNode("someCompany"))
            .withPredicate(IRI("https://polypoly.coop/storing"))
            .build()
        )
        runBlocking {
            polyIn.add(storageData)
        }
        var returnedData: List<Quad>
        runBlocking {
            returnedData = polyIn.select(
                Matcher(null, null, null)
            )
        }
        Truth.assertThat(returnedData.size).isEqualTo(storageData.size)
        Truth.assertThat(returnedData[0].predicate).isEqualTo(storageData[0].predicate)
    }

    @Test
    fun matcher_works() {
        val polyIn = PolyIn("test_database.nt")
        polyIn.clean()

        var storageData: List<Quad>  = listOf()
        storageData = storageData.plus(QuadBuilder.new().withDefaultGraph()
            .withObject(BlankNode("privateData"))
            .withSubject(BlankNode("someCompany"))
            .withPredicate(IRI("https://polypoly.coop/storing"))
            .build()
        )

        storageData = storageData.plus(QuadBuilder.new().withDefaultGraph()
            .withObject(BlankNode("privateData2"))
            .withSubject(BlankNode("someCompany2"))
            .withPredicate(IRI("https://polypoly.coop/storing"))
            .build()
        )

        storageData = storageData.plus(QuadBuilder.new().withDefaultGraph()
            .withObject(BlankNode("privateData3"))
            .withSubject(BlankNode("someCompany3"))
            .withPredicate(IRI("https://polypoly.coop/justChecking"))
            .build()
        )

        runBlocking {
            polyIn.add(storageData)
        }
        var returnedData: List<Quad>
        runBlocking {
            returnedData = polyIn.select(
                Matcher(
                    null,
                    IRI("https://polypoly.coop/justChecking"),
                    null
                )
            )
        }

        Truth.assertThat(returnedData.size).isEqualTo(1)
        Truth.assertThat(returnedData[0].predicate).isEqualTo(storageData[2].predicate)
    }
}
