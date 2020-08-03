package eu.polypoly.bubblewrap;

import net.jqwik.api.Arbitraries;
import net.jqwik.api.Arbitrary;
import net.jqwik.api.Group;
import net.jqwik.api.Tuple;

import java.util.Map;

class BubblewrapTest {

    @Group
    class DoubleSpec implements CodecSpec<Double> {
        @Override
        public Codec<Double> instance() {
            return Codec.doubleNumber;
        }

        @Override
        public Arbitrary<Double> t() {
            return Arbitraries.doubles();
        }
    }

    @Group
    class StringSpec implements CodecSpec<String> {
        @Override
        public Codec<String> instance() {
            return Codec.string;
        }

        @Override
        public Arbitrary<String> t() {
            return Arbitraries.strings();
        }
    }

    @Group
    class ArrayStringSpec implements CodecSpec<String[]> {
        @Override
        public Codec<String[]> instance() {
            return Codec.string.array(String[]::new);
        }

        @Override
        public Arbitrary<String[]> t() {
            return Arbitraries.strings().array(String[].class);
        }
    }

    @Group
    class MapStringStringSpec implements CodecSpec<Map<String, String>> {
        @Override
        public Codec<Map<String, String>> instance() {
            return Codec.string.map();
        }

        @Override
        public Arbitrary<Map<String, String>> t() {
            return Arbitraries.maps(Arbitraries.strings(), Arbitraries.strings());
        }
    }

    @Group
    class JSErrorSpec implements CodecSpec<JSError> {
        @Override
        public Codec<JSError> instance() {
            return Codec.jsError;
        }

        @Override
        public Arbitrary<JSError> t() {
            return Arbitraries.strings().map(JSError::new);
        }
    }

    @Group
    class UndefinedSpec implements CodecSpec<String> {
        @Override
        public Codec<String> instance() {
            return Codec.string.withUndefined();
        }

        @Override
        public Arbitrary<String> t() {
            return Arbitraries.frequencyOf(
                    Tuple.of(1, Arbitraries.just(null)),
                    Tuple.of(10, Arbitraries.strings())
            );
        }
    }

    @Group
    class TaggedSpec implements CodecSpec<String> {
        @Override
        public Codec<String> instance() {
            return Codec.string.taggedClass("foobar");
        }

        @Override
        public Arbitrary<String> t() {
            return Arbitraries.strings();
        }
    }

}
