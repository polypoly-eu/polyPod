package eu.polypoly.fetch;

import java.util.concurrent.CompletionStage;

public interface Response {
    boolean ok();
    int status();
    String statusText();
    CompletionStage<String> text();
}
