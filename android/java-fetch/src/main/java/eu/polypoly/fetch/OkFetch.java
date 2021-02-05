package eu.polypoly.fetch;

import okhttp3.*;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.Executors;

public final class OkFetch implements Fetch {

    private static final class OkResponse implements Response {

        private final okhttp3.Response response;
        private CompletionStage<String> body;

        public OkResponse(okhttp3.Response response) {
            this.response = response;
        }

        @Override
        public boolean ok() {
            return response.isSuccessful();
        }

        @Override
        public int status() {
            return response.code();
        }

        @Override
        public String statusText() {
            return response.message();
        }

        @Override
        public CompletionStage<String> text() {
            if (body != null)
                return body;

            try {
                body = CompletableFuture.completedFuture(response.body().string());
            }
            catch (IOException ex) {
                CompletableFuture<String> future = new CompletableFuture<>();
                future.completeExceptionally(ex);
                body = future;
            }
            finally {
                response.body().close();
            }

            return body;
        }
    }

    private final OkHttpClient client;

    private static OkHttpClient defaultClient() {
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        builder.dispatcher(new Dispatcher(Executors.newSingleThreadExecutor(runnable -> {
            Thread thread = new Thread(runnable);
            thread.setDaemon(false);
            return thread;
        })));
        return builder.build();
    }

    public OkFetch(OkHttpClient client) {
        this.client = client;
    }

    public OkFetch() {
        this(defaultClient());
    }

    @Override
    public CompletionStage<Response> fetch(String input, RequestInit init) {
        Request.Builder request = new Request.Builder().url(input);

        RequestBody body = null;
        if (init.body != null)
            body = RequestBody.create(init.body, null);

        String method = "get";
        if (init.method != null)
            method = init.method;
        request.method(method.toUpperCase(), body);

        if (init.headers != null)
            request.headers(Headers.of(init.headers));

        CompletableFuture<Response> promise = new CompletableFuture<>();
        client.newCall(request.build()).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                promise.completeExceptionally(e);
            }

            @Override
            public void onResponse(Call call, okhttp3.Response response) {
                promise.complete(new OkResponse(response));
            }
        });
        return promise;
    }
}
