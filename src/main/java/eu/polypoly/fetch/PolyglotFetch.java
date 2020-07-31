package eu.polypoly.fetch;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.TypeLiteral;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.proxy.ProxyExecutable;
import org.graalvm.polyglot.proxy.ProxyObject;

import java.util.Map;
import java.util.concurrent.CompletionStage;

public final class PolyglotFetch {

    private Value fromFuture(CompletionStage<?> stage) {
        var promiseConstructor = global.getMember("Promise");

        return promiseConstructor.newInstance((ProxyExecutable) arguments -> {
            Value resolve = arguments[0];
            Value reject = arguments[1];
            try {
                var result = stage.toCompletableFuture().join();
                resolve.execute(result);
            }
            catch (Exception ex) {
                reject.execute(ex);
            }
            return null;
        });
    }

    private Object fromResponse(Response response) {
        ProxyExecutable text = arguments -> fromFuture(response.text());
        ProxyExecutable json = arguments -> {
            var parse = global.getMember("JSON").getMember("parse");
            return fromFuture(response.text()).getMember("then").execute(parse);
        };

        return ProxyObject.fromMap(Map.of(
            "ok", response.ok(),
            "status", response.status(),
            "text", text,
            "json", json
        ));
    }

    private final Fetch impl;
    private final Value global;

    public final ProxyExecutable fetch;

    public PolyglotFetch(Fetch impl) {
        this.impl = impl;
        this.global = Context.getCurrent().getBindings("js");
        this.fetch = this::fetch;
    }

    private Object fetch(Value... arguments) {
        var input = arguments[0].asString();

        String body = null;
        Map<String, String> headers = null;
        String method = null;

        if (arguments.length > 1) {
            var init = arguments[1];
            var keys = init.getMemberKeys();

            if (keys.contains("body"))
                body = init.getMember("body").asString();

            if (keys.contains("headers"))
                headers = init.getMember("headers").as(new TypeLiteral<>() {});

            if (keys.contains("method"))
                method = init.getMember("method").asString();
        }

        var init = new RequestInit(
            body,
            headers,
            method
        );

        return fromFuture(impl.fetch(input, init).thenApply(this::fromResponse));
    }

    public static void fixEnv() {
        var process = Context.getCurrent().getBindings("js").getMember("process");
        var env = process.getMember("env");
        for (var entry : System.getenv().entrySet()) {
            System.out.println(entry);
            env.putMember(entry.getKey(), entry.getValue());
        }
    }

}
