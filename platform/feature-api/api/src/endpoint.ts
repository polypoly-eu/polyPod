/**
 * `Endpoint` allows Features to exchange data with external servers.
 *
 * Please note that unrestricted network communication is not possible for
 * polyPod Features, because it would be too difficult for the polyPod to help
 * the user understand what data is being sent to which entity for what
 * reason. The `Endpoint` API sidesteps this problem, by only allowing requests
 * to previously approved endpoints. Adding a new endpoint is currently not
 * possible without rebuilding and republishing the polyPod.
 */
export interface Endpoint {
    /**
     * Sends an HTTP POST request to the specified endpoint.
     * @param endpointId - The ID of the endpoint to send the request to.
     * @param payload - The payload (i.e. data) to send to the endpoint.
     * @param contentType - The content type of the payload.
     * @param authToken - The token to use for authentication. If not
     * specified, the default token will be used.
     * @throws Error If the endpoint is unreachable, or if the request was not
     * allowed.
     */
    send(
        endpointId: string,
        payload: string,
        contentType?: string,
        authToken?: string
    ): Promise<void>;

    /**
     * Sends an HTTP GET request to the specified endpoint.
     * @param endpointId - The ID of the endpoint to send the request to.
     * @param contentType - The content type of the request.
     * @param authToken - The token to use for authentication. If not
     * specified, the default token will be used.
     * @throws Error If the endpoint is unreachable, or if the request was not
     * allowed.
     */
    get(
        endpointId: string,
        contentType?: string,
        authToken?: string
    ): Promise<string>;
}
