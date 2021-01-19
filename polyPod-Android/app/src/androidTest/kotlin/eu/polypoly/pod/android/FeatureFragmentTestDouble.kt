package eu.polypoly.pod.android

class FeatureFragmentTestDouble : FeatureFragment() {
    fun overridePodApi(podApi: PodApi) {
        api = podApi;
    }
}
