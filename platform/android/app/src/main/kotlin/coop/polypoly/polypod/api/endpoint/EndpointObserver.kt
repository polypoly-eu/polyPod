package coop.polypoly.polypod.api.endpoint

class EndpointObserver(
    val approveEndpointFetch:
        suspend (String?, suspend (Boolean) -> String?) -> String?
)
