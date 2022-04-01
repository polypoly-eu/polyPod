package eu.polypoly.bubblewrap;

import net.jqwik.api.Arbitrary;
import net.jqwik.api.ForAll;
import net.jqwik.api.Property;
import net.jqwik.api.Provide;
import org.assertj.core.api.Assertions;
import org.msgpack.value.Value;

public interface CodecSpec<T> {

    Codec<T> instance();

    @Provide
    Arbitrary<T> t();

    @Property
    default void short_roundtrip(@ForAll("t") T t) {
        Value encoded = instance().encode(t);
        T decoded = instance().decode(encoded);
        Assertions.assertThat(decoded).isEqualTo(t);
    }

    @Property
    default void long_roundtrip(@ForAll("t") T t) {
        byte[] encoded = Bubblewrap.encode(t, instance());
        T decoded = Bubblewrap.decode(encoded, instance());
        Assertions.assertThat(decoded).isEqualTo(t);
    }

}
