import { dataImporters } from "../../importer";
import ImporterExecutionResult from "../../importers/utils/importer-execution-result";
import FacebookAccount from "../facebook-account";
import MessageThread from "../message-thread";
import MessageThreadsGroup from "../message-threads-group";
import RelatedAccount from "../related-account";
import RelatedAccountsGroup from "../related-accounts-group";
import RelatedPost from "../related-post";

const KnownClasses = [
    FacebookAccount,
    MessageThread,
    MessageThreadsGroup,
    RelatedAccount,
    RelatedAccountsGroup,
    RelatedPost,
    ImporterExecutionResult,
]
    .concat(dataImporters)
    .reduce((data, importerClass) => {
        data[importerClass.name] = importerClass;
        return data;
    }, {});

function objectReplacer(key, value) {
    if (value != null && value.__class__) {
        return KnownClasses[value.__class__].fromJSON(value);
    }
    return value;
}

/**
 * Deserialize the given JSON string into an object, by taking into account __class__.
 * For every value that has a __class__  property we create an instance of that class.
 *
 * @class
 */
export default class EntityDeserializer {
    static parse(jsonString) {
        let jsonObject = JSON.parse(jsonString, objectReplacer);
        return jsonObject;
    }
}
