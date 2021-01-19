package eu.polypoly.bubblewrap;

import net.jqwik.api.ForAll;
import net.jqwik.api.Property;
import net.jqwik.api.lifecycle.AfterProperty;
import net.jqwik.api.lifecycle.BeforeProperty;
import org.assertj.core.api.Assertions;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.TypeLiteral;
import org.graalvm.polyglot.Value;

import java.io.IOException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.DoubleSupplier;
import java.util.function.Function;

class InteropTest {

    private final static class TestA {
        private final double a;

        private TestA(double a) {
            this.a = a;
        }

        private final static Codec<TestA> codec =
            Codec.kvArray(Codec.string, Codec.id).xmap(
                raw -> new TestA(Codec.doubleNumber.decode(raw.get("a"))),
                obj -> {
                    Map<String, org.msgpack.value.Value> map = new LinkedHashMap<>();
                    map.put("a", Codec.doubleNumber.encode(obj.a));
                    return map;
                }
            ).taggedClass("TestA");
    }

    Context context;
    Value jsClass;
    Function<Value, Value> jsEncode;
    Function<Value, Value> jsDecode;

    @BeforeProperty
    void setup() throws IOException {
        context = Context.newBuilder("js").allowAllAccess(true).build();

        URL bubblewrapJS = getClass().getClassLoader().getResource("bubblewrap.js");

        context.eval(Source.newBuilder("js", bubblewrapJS).build());

        String bootstrapText =
            "class TestA { constructor(a) { this.a = a } f() { return this.a } };\n" +
                "const Bubblewrap = bubblewrap.Bubblewrap.create({ TestA });\n";

        context.eval(Source.newBuilder("js", bootstrapText, "<bootstrap>").build());

        jsClass = context.getBindings("js").getMember("TestA");

        Value jsBubblewrap = context.getBindings("js").getMember("Bubblewrap");
        jsEncode = jsBubblewrap.getMember("encode").as(new TypeLiteral<Function<Value, Value>>() {});
        jsDecode = jsBubblewrap.getMember("decode").as(new TypeLiteral<Function<Value, Value>>() {});
    }

    @AfterProperty
    void teardown() {
        context.close();
    }

    @Property
    void encode_in_js_and_decode_in_java(@ForAll double a) throws IOException {
        Value jsObject = jsClass.newInstance(a);
        Value encoded = jsEncode.apply(jsObject);

        Assertions.assertThat(encoded.hasArrayElements()).isTrue();

        // TODO custom host mapping for Uint8Array?
        short[] shortBuffer = encoded.as(short[].class);
        byte[] buffer = new byte[shortBuffer.length];
        for (int i = 0; i < shortBuffer.length; ++i)
            buffer[i] = (byte) shortBuffer[i];

        TestA decoded = Bubblewrap.decode(buffer, TestA.codec);

        Assertions.assertThat(decoded.a).isEqualTo(a);
    }

    @Property
    void encode_in_java_and_decode_in_js(@ForAll double a) throws IOException {
        byte[] encoded = Bubblewrap.encode(new TestA(a), TestA.codec);

        Value decoded = jsDecode.apply(Value.asValue(encoded));

        Assertions.assertThat(jsClass.isMetaInstance(decoded)).isTrue();
        Assertions.assertThat(decoded.getMember("a").asDouble()).isEqualTo(a);
        Assertions.assertThat(decoded.getMember("f").as(new TypeLiteral<DoubleSupplier>() {}).getAsDouble()).isEqualTo(a);
    }

}
