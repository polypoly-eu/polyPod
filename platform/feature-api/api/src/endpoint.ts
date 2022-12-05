/**
 * @interface Endpoint is the API features communicate with in order to perform fetch requests
 */
export interface Endpoint {
    /**
     * Perform a http post request to a specific endpoint in the pod
     * @param {string} endpointId - The ID of the endpoint to send the request to.
     * @param {string} payload - The payload to send to the endpoint.
     * @param {string} [contentType] - The content type of the payload.
     * @param {string} [authToken] - The token to use for authentication. If not provided, the default
     * token will be used.
     * @throws if an unsupported request goes through, if an endpoint is not reached or if a user denies a request
     */
    send(
        endpointId: string,
        payload: string,
        contentType?: string,
        authToken?: string
    ): Promise<void>;

    /**
     * Performs an http GET request to the endpoint of the given ID.
     * @param {string} endpointId - The ID of the endpoint.
     * @param {string} [contentType] - The content type of the request.
     * @param {string} [authToken] - The token to use for authentication.
     * @returns a promise with the payload of the response
     * @throws if an unsupported request goes through, if an endpoint is not reached, if a user denies a request or if response is null
     */
    get(
        endpointId: string,
        contentType?: string,
        authToken?: string
    ): Promise<string>;
}
