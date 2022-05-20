package coop.polypoly.polypod.util

import java.security.SecureRandom
import java.security.spec.AlgorithmParameterSpec
import javax.crypto.KeyGenerator
import javax.crypto.KeyGeneratorSpi
import javax.crypto.SecretKey

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
