package coop.polypoly.polypod.polyin

import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth
import coop.polypoly.polypod.polyIn.PolyIn
import coop.polypoly.polypod.polyIn.rdf.BlankNode
import coop.polypoly.polypod.polyIn.rdf.IRI
import coop.polypoly.polypod.polyIn.rdf.Matcher
import coop.polypoly.polypod.polyIn.rdf.Quad
import coop.polypoly.polypod.polyIn.rdf.QuadBuilder
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode
import java.io.File
import java.io.InputStream
import java.io.OutputStream
import java.security.Key
import java.security.KeyStore
import java.security.KeyStoreSpi
import java.security.Provider
import java.security.SecureRandom
import java.security.Security
import java.security.cert.Certificate
import java.security.spec.AlgorithmParameterSpec
import javax.crypto.KeyGenerator
import javax.crypto.KeyGeneratorSpi

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class PolyInTest {
    val TEST_DB_NAME = "test_database.nt"
    private var polyIn: PolyIn? = null

    init {
        Security.addProvider(object : Provider(
            "AndroidKeyStore", 1.0, ""
        ) {
                init {
                    put(
                        "KeyStore.AndroidKeyStore",
                        MockKeyStore::class.java.name
                    )
                    put(
                        "KeyGenerator.AES",
                        MockAesKeyGenerator::class.java.name
                    )
                }
            })
        File(null as File?, TEST_DB_NAME).delete()
        polyIn = PolyIn(
            context = androidx.test.core.app.ApplicationProvider
                .getApplicationContext(),
            databaseName = TEST_DB_NAME
        )
    }

    class MockKeyStore : KeyStoreSpi() {
        private val wrapped =
            KeyStore.getInstance(KeyStore.getDefaultType())

        override fun engineGetKey(p0: String?, p1: CharArray?) =
            wrapped.getKey(p0, p1)

        override fun engineGetCertificateChain(p0: String?) =
            wrapped.getCertificateChain(p0)

        override fun engineGetCertificate(p0: String?) =
            wrapped.getCertificate(p0)

        override fun engineGetCreationDate(p0: String?) =
            wrapped.getCreationDate(p0)

        override fun engineSetKeyEntry(
            p0: String?,
            p1: Key?,
            p2: CharArray?,
            p3: Array<out Certificate>?
        ) = wrapped.setKeyEntry(p0, p1, p2, p3)

        override fun engineSetKeyEntry(
            p0: String?,
            p1: ByteArray?,
            p2: Array<out Certificate>?
        ) = wrapped.setKeyEntry(p0, p1, p2)

        override fun engineSetCertificateEntry(p0: String?, p1: Certificate?) =
            wrapped.setCertificateEntry(p0, p1)

        override fun engineDeleteEntry(p0: String?) =
            wrapped.deleteEntry(p0)

        override fun engineAliases() =
            wrapped.aliases()

        override fun engineContainsAlias(p0: String?) =
            wrapped.containsAlias(p0)

        override fun engineSize(): Int =
            wrapped.size()

        override fun engineIsKeyEntry(p0: String?) =
            wrapped.isKeyEntry(p0)

        override fun engineIsCertificateEntry(p0: String?) =
            wrapped.isCertificateEntry(p0)

        override fun engineGetCertificateAlias(p0: Certificate?) =
            wrapped.getCertificateAlias(p0)

        override fun engineStore(p0: OutputStream?, p1: CharArray?) =
            wrapped.store(p0, p1)

        override fun engineLoad(p0: InputStream?, p1: CharArray?) =
            wrapped.load(p0, p1)
    }

    class MockAesKeyGenerator : KeyGeneratorSpi() {
        private val wrapped = KeyGenerator.getInstance("AES")

        override fun engineInit(p0: SecureRandom?) =
            wrapped.init(p0)

        override fun engineInit(
            p0: AlgorithmParameterSpec?,
            p1: SecureRandom?
        ) {
            // We ignore the Algorithm requirement for tests
            return wrapped.init(p1)
        }

        override fun engineInit(p0: Int, p1: SecureRandom?) =
            wrapped.init(p0, p1)

        override fun engineGenerateKey() =
            wrapped.generateKey()
    }

    @Before
    fun setup() {
        File(null as File?, TEST_DB_NAME).delete()
        polyIn?.clean()
    }

    @After
    fun teardown() {
        File(null as File?, TEST_DB_NAME).delete()
    }

    @Test
    fun storingStrings_works() {
        val storageData: List<Quad> = listOf(
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData"))
                .withSubject(BlankNode("someCompany"))
                .withPredicate(IRI("https://polypoly.coop/storing"))
                .build()
        )
        runBlocking {
            polyIn?.add(storageData)
        }
        val returnedData = runBlocking {
            polyIn?.select(
                Matcher(null, null, null)
            )
        }
        Truth.assertThat(returnedData?.size).isEqualTo(storageData.size)
        Truth.assertThat(returnedData!![0].predicate)
            .isEqualTo(storageData[0].predicate)
    }

    @Test
    fun matcher_works() {
        val storageData: List<Quad> = listOf(
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData"))
                .withSubject(BlankNode("someCompany"))
                .withPredicate(IRI("https://polypoly.coop/storing"))
                .build(),
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData2"))
                .withSubject(BlankNode("someCompany2"))
                .withPredicate(IRI("https://polypoly.coop/storing"))
                .build(),
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData3"))
                .withSubject(BlankNode("someCompany3"))
                .withPredicate(IRI("https://polypoly.coop/justChecking"))
                .build()
        )

        runBlocking {
            polyIn?.add(storageData)
        }
        val returnedData = runBlocking {
            polyIn?.select(
                Matcher(
                    null,
                    IRI("https://polypoly.coop/justChecking"),
                    null
                )
            )
        }

        Truth.assertThat(returnedData!!.size).isEqualTo(1)
        Truth.assertThat(
            returnedData!![0].predicate
        ).isEqualTo(storageData[2].predicate)
    }

    @Test
    fun coldStorage_works() {
        val storageData: List<Quad> = listOf(
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData"))
                .withSubject(BlankNode("someCompany"))
                .withPredicate(IRI("https://polypoly.coop/storing"))
                .build()
        )
        val database = File(null as File?, TEST_DB_NAME)
        if (database.exists()) {
            database.delete()
        }
        PolyIn(
            context = androidx.test.core.app.ApplicationProvider
                .getApplicationContext(),
            databaseName = TEST_DB_NAME
        ).let {
            runBlocking {
                it.add(storageData)
            }
        }

        val returnedData = PolyIn(
            context = androidx.test.core.app.ApplicationProvider
                .getApplicationContext(),
            databaseName = TEST_DB_NAME
        ).let {
            runBlocking {
                it.select(
                    Matcher(null, null, null)
                )
            }
        }
        Truth.assertThat(returnedData?.size).isEqualTo(storageData.size)
        Truth.assertThat(returnedData!![0].predicate)
            .isEqualTo(storageData[0].predicate)
    }

    @Test
    fun renaming_fails() {
        val storageData: List<Quad> = listOf(
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData"))
                .withSubject(BlankNode("someCompany"))
                .withPredicate(IRI("https://polypoly.coop/storing"))
                .build()
        )

        val originalPath = "1" + TEST_DB_NAME
        val originalDatabase = File(null as File?, originalPath)
        if (originalDatabase.exists()) {
            originalDatabase.delete()
        }
        PolyIn(
            context = androidx.test.core.app.ApplicationProvider
                .getApplicationContext(),
            databaseName = originalPath
        ).let { runBlocking { it.add(storageData) } }

        val movedPath = "2" + TEST_DB_NAME
        val movedDatabase = File(null as File?, movedPath)
        originalDatabase.copyTo(movedDatabase)
        // Moving/renaming encrypted file invalidates encryption
        Truth.assertThat(
            kotlin.runCatching {
                PolyIn(
                    context = androidx.test.core.app.ApplicationProvider
                        .getApplicationContext(),
                    databaseName = movedPath
                )
            }.isFailure
        ).isTrue()

        movedDatabase.delete()
        originalDatabase.delete()
    }

    @Test
    fun delete_works() {
        matcher_works()
        val firstElement: List<Quad> = listOf(
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData"))
                .withSubject(BlankNode("someCompany"))
                .withPredicate(IRI("https://polypoly.coop/storing"))
                .build()
        )

        runBlocking {
            polyIn?.delete(firstElement)
        }
        val returnedData = runBlocking {
            polyIn?.select(
                Matcher(
                    null,
                    null,
                    null
                )
            )
        }

        Truth.assertThat(returnedData!!.size).isEqualTo(2)
        val deleted = returnedData!!.any { res ->
            res.`object`.equals(BlankNode("privateData"))
        }
        Truth.assertThat(deleted).isFalse()
    }

    @Test
    fun has_works() {
        matcher_works()
        val existingElement: List<Quad> = listOf(
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("privateData"))
                .withSubject(BlankNode("someCompany"))
                .withPredicate(IRI("https://polypoly.coop/storing"))
                .build()
        )
        val nonExistingElement: List<Quad> = listOf(
            QuadBuilder.new().withDefaultGraph()
                .withObject(BlankNode("nonexisting"))
                .withSubject(BlankNode("nonexisting"))
                .withPredicate(IRI("https://polypoly.coop/nonexisting"))
                .build()
        )

        Truth.assertThat(
            runBlocking {
                polyIn?.has(existingElement)
            }
        ).isTrue()

        Truth.assertThat(
            runBlocking {
                polyIn?.has(nonExistingElement)
            }
        ).isFalse()
    }
}
