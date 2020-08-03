package eu.polypoly.bubblewrap;

import org.msgpack.core.MessageBufferPacker;
import org.msgpack.core.MessagePack;
import org.msgpack.core.MessageTypeCastException;
import org.msgpack.core.MessageUnpacker;
import org.msgpack.value.ArrayValue;
import org.msgpack.value.ExtensionValue;
import org.msgpack.value.MapValue;
import org.msgpack.value.Value;
import org.msgpack.value.impl.*;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.function.IntFunction;
import java.util.stream.Stream;

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
        Codec<T> codecT = this;
        return new Codec<U>() {
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
        Codec<T> codec = this;
        return new Codec<T>() {
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
        Codec<T> codec = this;
        return new Codec<T>() {
            @Override
            public Value encode(T t) {
                MessageBufferPacker packer = MessagePack.newDefaultBufferPacker();
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
                ExtensionValue ext = value.asExtensionValue();
                if (ext.getType() != msgPackEtypeClass)
                    throw new MessageTypeCastException("Expected object");

                MessageUnpacker unpacker = MessagePack.newDefaultUnpacker(ext.getData());

                Value data;

                try {
                    int length = unpacker.unpackArrayHeader();
                    if (length != 2)
                        throw new IllegalArgumentException("Malformed message, array must have two elements");
                    String actualName = unpacker.unpackString();
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
        Codec<T> codec = this;
        return new Codec<T[]>() {
            @Override
            public Value encode(T[] array) {
                Objects.requireNonNull(array);
                return new ImmutableArrayValueImpl(
                    Stream.of(array).map(codec::encode).toArray(Value[]::new)
                );
            }

            @Override
            public T[] decode(Value value) {
                ArrayValue array = value.asArrayValue();
                int size = array.size();
                T[] result = creator.apply(size);
                for (int i = 0; i < size; ++i)
                    result[i] = codec.decode(array.get(i));
                return result;
            }
        };
    }

    default Codec<Map<String, T>> map() {
        Codec<T> codec = this;
        return new Codec<Map<String, T>>() {
            @Override
            public Value encode(Map<String, T> map) {
                Objects.requireNonNull(map);
                List<Value> encoded = new ArrayList<Value>(map.size() * 2);
                for (Map.Entry<String, T> entry : map.entrySet()) {
                    encoded.add(string.encode(entry.getKey()));
                    encoded.add(codec.encode(entry.getValue()));
                }
                return new ImmutableMapValueImpl(encoded.toArray(new Value[0]));
            }

            @Override
            public Map<String, T> decode(Value value) {
                MapValue map = value.asMapValue();
                Map<String, T> decoded = new LinkedHashMap<String, T>(map.size());
                for (Map.Entry<Value, Value> entry : map.entrySet())
                    decoded.put(string.decode(entry.getKey()), codec.decode(entry.getValue()));
                return decoded;
            }
        };
    }

    Codec<JSError> jsError = new Codec<JSError>() {
        @Override
        public Value encode(JSError e) {
            Objects.requireNonNull(e);
            MessageBufferPacker packer = MessagePack.newDefaultBufferPacker();
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
            ExtensionValue ext = value.asExtensionValue();
            if (ext.getType() != msgPackEtypeError)
                throw new MessageTypeCastException("Expected `Error`");

            MessageUnpacker unpacker = MessagePack.newDefaultUnpacker(ext.getData());
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
        return new Codec<Map<K, V>>() {
            @Override
            public Value encode(Map<K, V> map) {
                Objects.requireNonNull(map);
                Value[] encoded =
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
                ArrayValue array = value.asArrayValue();

                Map<K, V> decoded = new LinkedHashMap<K, V>(array.size());
                for (Value kv : array) {
                    ArrayValue inner = kv.asArrayValue();
                    if (inner.size() != 2)
                        throw new IllegalArgumentException("Malformed message; expected two array elements");

                    K k = keyCodec.decode(inner.get(0));
                    V v = valueCodec.decode(inner.get(1));

                    decoded.put(k, v);
                }

                return decoded;
            }
        };
    }

    Codec<Boolean> bool = new Codec<Boolean>() {
        @Override
        public Value encode(Boolean bool) {
            if (bool)
                return ImmutableBooleanValueImpl.TRUE;
            else
                return ImmutableBooleanValueImpl.FALSE;
        }

        @Override
        public Boolean decode(Value value) {
            return value.asBooleanValue().getBoolean();
        }
    };

    Codec<Double> doubleNumber = new Codec<Double>() {
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
