import DataEntitiesCountAnalysis from "./data-count.js";

class SearchesAnalysis extends DataEntitiesCountAnalysis {
    constructor() {
        super("search/your_search_history.json", "searches_v2");
    }
    get title() {
        return "Your Search History";
    }

    render() {
        if (!this.active) {
            return "No Searches!";
        }
        return `There are ${this.dataEntitiesCount} words, phrases and names you've searched for`;
    }
}

export default SearchesAnalysis;
