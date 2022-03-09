package eu.polypoly.fetch;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.TypeLiteral;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.proxy.ProxyExecutable;
import org.graalvm.polyglot.proxy.ProxyObject;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletionStage;

public final class PolyglotFetch {

    private Value fromFuture(CompletionStage<?> stage) {
        Value promiseConstructor = global.getMember("Promise");
        Value errorConstructor = global.getMember("Error");

        return promiseConstructor.newInstance((ProxyExecutable) arguments -> {
            Value resolve = arguments[0];
            Value reject = arguments[1];
            try {
                Object result = stage.toCompletableFuture().join();
                resolve.execute(result);
            }
            catch (Exception ex) {
                reject.execute(errorConstructor.newInstance(ex.toString()));
            }
            return null;
        });
    }

    private Object fromResponse(Response response) {
        ProxyExecutable text = arguments -> fromFuture(response.text());
        ProxyExecutable json = arguments -> {
            Value parse = global.getMember("JSON").getMember("parse");
            return fromFuture(response.text()).getMember("then").execute(parse);
        };

        Map<String, Object> props = new LinkedHashMap<>();
        props.put("ok", response.ok());
        props.put("status", response.status());
        props.put("text", text);
        props.put("json", json);

        return ProxyObject.fromMap(props);
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
        String input = arguments[0].asString();

        String body = null;
        Map<String, String> headers = null;
        String method = null;

        if (arguments.length > 1) {
            Value init = arguments[1];
            Set<String> keys = init.getMemberKeys();

            if (keys.contains("body"))
                body = init.getMember("body").asString();

            if (keys.contains("headers"))
                headers = init.getMember("headers").as(new TypeLiteral<Map<String, String>>() {});

            if (keys.contains("method"))
                method = init.getMember("method").asString();
        }

        RequestInit init = new RequestInit(
            body,
            headers,
            method
        );

        return fromFuture(impl.fetch(input, init).thenApply(this::fromResponse));
    }

}
