package eu.polypoly.bubblewrap;

import net.jqwik.api.Arbitraries;
import net.jqwik.api.Arbitrary;
import net.jqwik.api.Group;

import java.util.Objects;

class ChoiceCodecTest {

    static class Supertype {}

    static final class Subtype1 extends Supertype {
        private final String string;

        public Subtype1(String string) {
            this.string = string;
        }

        public String getString() {
            return string;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Subtype1 subtype1 = (Subtype1) o;
            return Objects.equals(string, subtype1.string);
        }

        @Override
        public int hashCode() {
            return Objects.hash(string);
        }

        public static final Codec<Subtype1> codec =
            Codec.string.xmap(Subtype1::new, Subtype1::getString).taggedClass("subtype1");
    }

    static final class Subtype2 extends Supertype {
        private final double number;

        public Subtype2(double number) {
            this.number = number;
        }

        public double getNumber() {
            return number;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Subtype2 subtype2 = (Subtype2) o;
            return Double.compare(subtype2.number, number) == 0;
        }

        @Override
        public int hashCode() {
            return Objects.hash(number);
        }

        public static final Codec<Subtype2> codec =
            Codec.doubleNumber.xmap(Subtype2::new, Subtype2::getNumber).taggedClass("subtype2");
    }

    @Group
    class ChoiceSpec implements CodecSpec<Supertype> {
        @Override
        public Codec<Supertype> instance() {
            return Codec.choice(
                new Codec.Choice<>(Subtype1.class, Subtype1.codec),
                new Codec.Choice<>(Subtype2.class, Subtype2.codec)
            );
        }

        @Override
        public Arbitrary<Supertype> t() {
            return Arbitraries.oneOf(
                Arbitraries.strings().map(Subtype1::new),
                Arbitraries.doubles().map(Subtype2::new)
            );
        }
    }

}
