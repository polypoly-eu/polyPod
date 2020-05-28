package eu.polypoly.bubblewrap;

import org.msgpack.core.MessagePack;
import org.msgpack.core.MessageTypeCastException;
import org.msgpack.value.Value;
import org.msgpack.value.impl.*;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.function.IntFunction;

public interface Codec<T> {

    byte msgPackEtypeUndef = 1;
    byte msgPackEtypeClass = 2;
    byte msgPackEtypeError = 3;

    Value encode(T t);
    T decode(Value value);

    Codec<Value> id = new Codec<Value>() {
        @Override
        public Value encode(Value value) {
            return value;
        }

        @Override
        public Value decode(Value value) {
            return value;
        }
    };

    default <U> Codec<U> xmap(Function<T, U> tu, Function<U, T> ut) {
        var codecT = this;
        return new Codec<>() {
            @Override
            public Value encode(U u) {
                return codecT.encode(ut.apply(u));
            }

            @Override
            public U decode(Value value) {
                return tu.apply(codecT.decode(value));
            }
        };
    }

    default Codec<T> withUndefined() {
        var codec = this;
        return new Codec<>() {
            @Override
            public Value encode(T t) {
                if (t == null)
                    return new ImmutableExtensionValueImpl(msgPackEtypeUndef, new byte[0]);

                return codec.encode(t);
            }

            @Override
            public T decode(Value value) {
                if (value.isExtensionValue() && value.asExtensionValue().getType() == msgPackEtypeUndef)
                    return null;

                return codec.decode(value);
            }
        };
    }

    default Codec<T> taggedClass(String name) {
        var codec = this;
        return new Codec<>() {
            @Override
            public Value encode(T t) {
                var packer = MessagePack.newDefaultBufferPacker();
                try {
                    packer.packArrayHeader(2);
                    packer.packString(name);
                    packer.packValue(codec.encode(t));
                }
                catch (IOException ex) {
                    throw new RuntimeException("Encoding object failed", ex);
                }

                return new ImmutableExtensionValueImpl(msgPackEtypeClass, packer.toByteArray());
            }

            @Override
            public T decode(Value value) {
                var ext = value.asExtensionValue();
                if (ext.getType() != msgPackEtypeClass)
                    throw new MessageTypeCastException("Expected object");

                var unpacker = MessagePack.newDefaultUnpacker(ext.getData());

                Value data;

                try {
                    var length = unpacker.unpackArrayHeader();
                    if (length != 2)
                        throw new IllegalArgumentException("Malformed message, array must have two elements");
                    var actualName = unpacker.unpackString();
                    if (!actualName.equals(name))
                        throw new MessageTypeCastException("Expected " + name + ", got " + actualName);
                    data = unpacker.unpackValue();
                }
                catch (IOException ex) {
                    throw new RuntimeException("Decoding object failed");
                }

                return codec.decode(data);
            }
        };
    }

    default Codec<T[]> array(IntFunction<T[]> creator) {
        var codec = this;
        return new Codec<>() {
            @Override
            public Value encode(T[] array) {
                Objects.requireNonNull(array);
                return new ImmutableArrayValueImpl(
                        List.of(array).stream().map(codec::encode).toArray(Value[]::new)
                );
            }

            @Override
            public T[] decode(Value value) {
                var array = value.asArrayValue();
                var size = array.size();
                var result = creator.apply(size);
                for (var i = 0; i < size; ++i)
                    result[i] = codec.decode(array.get(i));
                return result;
            }
        };
    }

    default Codec<Map<String, T>> map() {
        var codec = this;
        return new Codec<>() {
            @Override
            public Value encode(Map<String, T> map) {
                Objects.requireNonNull(map);
                var encoded = new ArrayList<Value>(map.size() * 2);
                for (var entry : map.entrySet()) {
                    encoded.add(string.encode(entry.getKey()));
                    encoded.add(codec.encode(entry.getValue()));
                }
                return new ImmutableMapValueImpl(encoded.toArray(new Value[0]));
            }

            @Override
            public Map<String, T> decode(Value value) {
                var map = value.asMapValue();
                var decoded = new LinkedHashMap<String, T>(map.size());
                for (var entry : map.entrySet())
                    decoded.put(string.decode(entry.getKey()), codec.decode(entry.getValue()));
                return decoded;
            }
        };
    }

    Codec<JSError> jsError = new Codec<JSError>() {
        @Override
        public Value encode(JSError e) {
            Objects.requireNonNull(e);
            var packer = MessagePack.newDefaultBufferPacker();
            try {
                packer.packString(e.getMessage());
            }
            catch (IOException ex) {
                throw new RuntimeException("Encoding exception failed", ex);
            }

            return new ImmutableExtensionValueImpl(msgPackEtypeError, packer.toByteArray());
        }

        @Override
        public JSError decode(Value value) {
            var ext = value.asExtensionValue();
            if (ext.getType() != msgPackEtypeError)
                throw new MessageTypeCastException("Expected `Error`");

            var unpacker = MessagePack.newDefaultUnpacker(ext.getData());
            try {
                return new JSError(unpacker.unpackString());
            }
            catch (IOException ex) {
                throw new RuntimeException("Decoding exception failed", ex);
            }
        }
    };

    Codec<String> string = new Codec<String>() {
        @Override
        public Value encode(String s) {
            Objects.requireNonNull(s);
            return new ImmutableStringValueImpl(s);
        }

        @Override
        public String decode(Value value) {
            return value.asStringValue().asString();
        }
    };

    static <K, V> Codec<Map<K, V>> kvArray(Codec<K> keyCodec, Codec<V> valueCodec) {
        return new Codec<>() {
            @Override
            public Value encode(Map<K, V> map) {
                Objects.requireNonNull(map);
                var encoded =
                    map.entrySet().stream().map(entry ->
                        new ImmutableArrayValueImpl(new Value[] {
                                keyCodec.encode(entry.getKey()),
                                valueCodec.encode(entry.getValue())
                        })
                    ).toArray(Value[]::new);

                return new ImmutableArrayValueImpl(encoded);
            }

            @Override
            public Map<K, V> decode(Value value) {
                var array = value.asArrayValue();

                var decoded = new LinkedHashMap<K, V>(array.size());
                for (var kv : array) {
                    var inner = kv.asArrayValue();
                    if (inner.size() != 2)
                        throw new IllegalArgumentException("Malformed message; expected two array elements");

                    var k = keyCodec.decode(inner.get(0));
                    var v = valueCodec.decode(inner.get(1));

                    decoded.put(k, v);
                }

                return decoded;
            }
        };
    }

    Codec<Double> doubleNumber = new Codec<>() {
        @Override
        public Value encode(Double number) {
            return new ImmutableDoubleValueImpl(number);
        }

        @Override
        public Double decode(Value value) {
            return value.asNumberValue().toDouble();
        }
    };

}
