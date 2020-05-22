package eu.polypoly.bubblewrap;

import java.util.Objects;

public final class JSError extends Exception {

    private final String message;

    public JSError(String message) {
        super(message);
        Objects.requireNonNull(message);
        this.message = message;
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JSError jsError = (JSError) o;
        return message.equals(jsError.message);
    }

    @Override
    public int hashCode() {
        return Objects.hash(message);
    }

}
