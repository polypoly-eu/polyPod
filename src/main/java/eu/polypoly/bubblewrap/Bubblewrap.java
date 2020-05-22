package eu.polypoly.bubblewrap;

import org.msgpack.core.MessagePack;
import org.msgpack.value.Value;

import java.io.IOException;

public class Bubblewrap {

    // TODO universal Codec<Object>

    private Bubblewrap() {}

    public static <T> byte[] encode(T t, Codec<T> codec) {
        var packer = MessagePack.newDefaultBufferPacker();
        try {
            packer.packValue(codec.encode(t));
        }
        catch (IOException ex) {
            throw new RuntimeException("Encoding failed", ex);
        }

        return packer.toByteArray();
    }

    public static <T> T decode(byte[] data, Codec<T> codec) {
        var unpacker = MessagePack.newDefaultUnpacker(data);
        Value value;
        try {
            value = unpacker.unpackValue();
            if (unpacker.hasNext())
                throw new IllegalArgumentException("Trailing data in buffer");
        }
        catch (IOException ex) {
            throw new RuntimeException("Decoding failed", ex);
        }

        return codec.decode(value);
    }

}
