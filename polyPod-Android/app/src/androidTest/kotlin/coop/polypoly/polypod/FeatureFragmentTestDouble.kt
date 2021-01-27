package coop.polypoly.polypod

import coop.polypoly.polypod.FeatureFragment
import coop.polypoly.polypod.PodApi

class FeatureFragmentTestDouble : FeatureFragment() {
    fun overridePodApi(podApi: PodApi) {
        api = podApi;
    }
}
