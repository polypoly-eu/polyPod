package coop.polypoly.polypod.endpoint


class EndpointObserver(val approveEndpointFetch:
                       ( String?,  suspend (Boolean) -> String?) -> Unit)

