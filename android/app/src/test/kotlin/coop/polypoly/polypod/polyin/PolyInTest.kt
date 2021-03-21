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
        val polyIn: PolyIn = PolyIn()
        var storageData: List<Quad>  = listOf()
        storageData = storageData.plus(QuadBuilder.new().withDefaultGraph(
        ).withObject(
            BlankNode("testObject")
        ).withSubject(
            BlankNode("testSubj")
        ).withPredicate(
            IRI("testPredicate")
        ).build())
        runBlocking {
            polyIn.add(storageData)
        }
        var returnedData: List<Quad> = listOf()
        runBlocking {
            returnedData = polyIn.select(
                Matcher(IRI(""), IRI(""), IRI(""))
            )
        }
        Truth.assertThat(returnedData).isEqualTo(storageData)
    }

    @Test
    fun matcher_works() {
        val polyIn: PolyIn = PolyIn()
        val storageData: List<Quad>  = listOf()
        storageData.plus(QuadBuilder.new().withDefaultGraph(
        ).withObject(
            BlankNode("testObject")
        ).withSubject(
            BlankNode("testSubj")
        ).withPredicate(
            IRI("testPredicate")
        ).build())
        runBlocking {
            testScope.launch {
                polyIn.add(storageData)
            }
        }
        var returnedData: List<Quad> = listOf()
        runBlocking {
            testScope.launch {
                returnedData = polyIn.select(
                    Matcher(IRI(""), IRI(""), IRI(""))
                )
            }
        }

        Truth.assertThat(returnedData).isEqualTo(storageData)
    }
}
