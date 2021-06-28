package coop.polypoly.polypod

class FeatureFragmentTestDouble : FeatureFragment() {
    fun overridePodApi(podApi: PodApi) {
        // TODO: This logic fell apart when we moved the API communication
        //       to FeatureContainer
        // api = podApi
    }
}
