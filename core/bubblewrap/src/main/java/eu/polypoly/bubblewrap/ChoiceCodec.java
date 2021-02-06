package eu.polypoly.bubblewrap;

import org.msgpack.core.MessageTypeCastException;
import org.msgpack.value.Value;

import java.util.List;
import java.util.Optional;

final class ChoiceCodec<T> implements Codec<T> {

    private final List<Choice<T, ? extends T>> choices;

    ChoiceCodec(List<Choice<T, ? extends T>> choices) {
        this.choices = choices;
    }

    @Override
    public Value encode(T t) {
        for (Choice<T, ? extends T> choice : choices) {
            Optional<Value> value = choice.tryEncode(t);
            if (value.isPresent())
                return value.get();
        }

        throw new IllegalArgumentException("No choice matched object");
    }

    @Override
    public T decode(Value value) {
        for (Choice<T, ? extends T> choice : choices) {
            try {
                return choice.codec.decode(value);
            }
            catch (MessageTypeCastException ex) {
                // intentionally left blank
            }
        }

        throw new MessageTypeCastException("No choice decoded object");
    }
}
