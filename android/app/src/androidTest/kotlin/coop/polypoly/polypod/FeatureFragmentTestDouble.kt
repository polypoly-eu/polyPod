package coop.polypoly.polypod

class FeatureFragmentTestDouble : FeatureFragment() {
    fun overridePodApi(podApi: PodApi) {
        api = podApi
    }
}
