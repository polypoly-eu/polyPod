import { groupPostReactionsByType } from "../utils/post-reactions-utils";
import { RootAnalysis } from "@polypoly-eu/poly-analysis";
import { KNOWN_REACTION_TYPES } from "../../importers/post-reactions-importer";
import analysisKeys from "../utils/analysisKeys";

export default class PostReactionsTypesAnalysis extends RootAnalysis {
    async analyze({ dataAccount }) {
        const allReactionsByType = groupPostReactionsByType(dataAccount);
        let reactionsTypeCountPairs = allReactionsByType.filter((each) =>
            KNOWN_REACTION_TYPES.includes(each.type)
        );
        if (reactionsTypeCountPairs.length > 0)
            dataAccount.analyses[analysisKeys.reactionsTypeCountPairs] =
                reactionsTypeCountPairs;
    }
}
