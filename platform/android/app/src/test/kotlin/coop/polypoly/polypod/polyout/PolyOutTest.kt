package coop.polypoly.polypod.polyout

import android.graphics.Bitmap
import android.net.Uri
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.google.common.truth.Truth
import coop.polypoly.polypod.features.FeatureInterface
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.polyOut.PolyOut
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Shadows
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode
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
import java.util.Collections
import java.util.Date
import java.util.Enumeration
import javax.crypto.KeyGenerator
import javax.crypto.KeyGeneratorSpi
import javax.crypto.SecretKey

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class PolyOutTest {

    class MockFeature(
        override val id: String,
        override val name: String,
        override val author: String,
        override val description: String,
        override val primaryColor: Int,
        override val thumbnailColor: Int,
        override val thumbnail: Bitmap?
    ) : FeatureInterface {
        override fun findUrl(target: String): String? {
            return null
        }
    }

    @Suppress("TooManyFunctions")
    class FakeKeyStore : KeyStoreSpi() {
        override fun engineIsKeyEntry(
            alias: String?
        ): Boolean = wrapped.isKeyEntry(alias)

        override fun engineIsCertificateEntry(
            alias: String?
        ): Boolean = wrapped.isCertificateEntry(alias)

        override fun engineGetCertificate(
            alias: String?
        ): Certificate = wrapped.getCertificate(alias)

        override fun engineGetCreationDate(
            alias: String?
        ): Date = wrapped.getCreationDate(alias)

        override fun engineDeleteEntry(alias: String?) {
            storedKeys.remove(alias)
        }

        override fun engineSetKeyEntry(
            alias: String?,
            key: Key?,
            password: CharArray?,
            chain: Array<out Certificate>?
        ) =
            wrapped.setKeyEntry(alias, key, password, chain)

        override fun engineSetKeyEntry(
            alias: String?,
            key: ByteArray?,
            chain: Array<out Certificate>?
        ) = wrapped.setKeyEntry(alias, key, chain)

        override fun engineStore(
            stream: OutputStream?,
            password: CharArray?
        ) = wrapped.store(stream, password)

        override fun engineSize(): Int = wrapped.size()

        override fun engineAliases(): Enumeration<String> = Collections.enumeration(storedKeys.keys) // ktlint-disable max-line-length

        override fun engineContainsAlias(
            alias: String?
        ): Boolean = storedKeys.containsKey(alias)

        override fun engineLoad(
            stream: InputStream?,
            password: CharArray?
        ) = wrapped.load(stream, password)

        override fun engineGetCertificateChain(
            alias: String?
        ): Array<Certificate>? = wrapped.getCertificateChain(alias)

        override fun engineSetCertificateEntry(
            alias: String?,
            cert: Certificate?
        ) = wrapped.setCertificateEntry(alias, cert)

        override fun engineGetCertificateAlias(
            cert: Certificate?
        ): String? = wrapped.getCertificateAlias(cert)

        override fun engineGetKey(
            alias: String?,
            password: CharArray?
        ): Key? = (storedKeys[alias] as? KeyStore.SecretKeyEntry)?.secretKey

        override fun engineGetEntry(
            p0: String,
            p1: KeyStore.ProtectionParameter?
        ): KeyStore.Entry? = storedKeys[p0]

        override fun engineSetEntry(
            p0: String,
            p1: KeyStore.Entry,
            p2: KeyStore.ProtectionParameter?
        ) {
            storedKeys[p0] = p1
        }

        override fun engineLoad(
            p0: KeyStore.LoadStoreParameter?
        ) = wrapped.load(p0)

        override fun engineStore(
            p0: KeyStore.LoadStoreParameter?
        ) = wrapped.store(p0)

        override fun engineEntryInstanceOf(
            p0: String?,
            p1: Class<out KeyStore.Entry>?
        ) = wrapped.entryInstanceOf(p0, p1)

        companion object {
            private val wrapped = KeyStore.getInstance("BKS", "BC")
            internal val storedKeys = mutableMapOf<String, KeyStore.Entry>()
        }
    }

    class FakeAesKeyGenerator : KeyGeneratorSpi() {
        private val wrapped = KeyGenerator.getInstance("AES", "BC")
        private var lastSpec: AlgorithmParameterSpec? = null

        override fun engineInit(random: SecureRandom?) = wrapped.init(random)

        override fun engineInit(
            params: AlgorithmParameterSpec?,
            random: SecureRandom?
        ) = wrapped.init(random).also {
            lastSpec = params
        }

        override fun engineInit(
            keysize: Int,
            random: SecureRandom?
        ) = wrapped.init(keysize, random)

        override fun engineGenerateKey(): SecretKey = wrapped.generateKey()
    }

    private var polyOut: PolyOut? = null

    init {
        polyOut = PolyOut(
            context = InstrumentationRegistry.getInstrumentation().targetContext
        )
    }

    @Before
    fun setup() {
        Security.addProvider(object : Provider("AndroidKeyStore", 1.0, "") {
            init {
                put("KeyStore.AndroidKeyStore", FakeKeyStore::class.java.name)
                put("KeyGenerator.AES", FakeAesKeyGenerator::class.java.name)
            }
        })

        FeatureStorage.activeFeature = MockFeature(
            id = "testFeatureId",
            name = "testFeature",
            author = "test",
            description = "",
            primaryColor = 0,
            thumbnailColor = 0,
            thumbnail = null
        )
    }

    @After
    fun teardown() {
        //
    }

    @Test
    fun importOneArchiveWorks() {
        val url = InstrumentationRegistry
            .getInstrumentation()
            .javaClass.classLoader!!
            .getResource("testZip.zip")
            .toString()
        val inputStream = InstrumentationRegistry
            .getInstrumentation()
            .javaClass.classLoader!!
            .getResource("testZip.zip")
            .openStream()

        val context = InstrumentationRegistry.getInstrumentation().targetContext
        val resolver = Shadows.shadowOf(context.contentResolver)
        resolver.registerInputStream(Uri.parse(url), inputStream)

        val result = runBlocking {
            polyOut?.importArchive(url = url)
        }

        Truth.assertThat(result).isNotEmpty()
    }
}
