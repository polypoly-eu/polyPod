package coop.polypoly.polypod.endpoint


class EndpointObserver(
    val approveEndpointFetch:
    suspend (String?, suspend (Boolean) -> String?) -> String?
)

