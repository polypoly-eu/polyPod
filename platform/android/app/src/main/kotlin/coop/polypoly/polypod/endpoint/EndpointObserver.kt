package coop.polypoly.polypod.endpoint


class EndpointObserver(val approveEndpointFetch:
                       (suspend (String?) -> Boolean?)? = null)

