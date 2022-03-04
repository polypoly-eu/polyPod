package eu.polypoly.fetch;

import java.util.Map;

public final class RequestInit {
    final String body;
    final Map<String, String> headers;
    final String method;

    public RequestInit(String body, Map<String, String> headers, String method) {
        this.body = body;
        this.headers = headers;
        this.method = method;
    }
}
