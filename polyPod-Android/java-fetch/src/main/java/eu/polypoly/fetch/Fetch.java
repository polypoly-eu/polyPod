package eu.polypoly.fetch;

import java.util.concurrent.CompletionStage;

public interface Fetch {
    CompletionStage<Response> fetch(String input, RequestInit init);
}
