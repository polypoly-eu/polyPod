import { OffFacebookEntity, OffFacebookEvent } from "../model";

export default class OffFacebookEventsRDFAnalysis {
    get title() {
        return "Off-Facebook events - RDF";
    }

    async analyze({ zipFile }) {
        this._eventsCount = 0;
        this._companiesCount = 0;
        this.active = false;
        if (!zipFile) return;

        const pod = window.pod;
        const { dataFactory, polyIn } = pod;

        const offFacebookEvents = await pod.polyIn.select({
            predicate: {
                value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
            },
            object: { value: OffFacebookEvent.name },
        });
        this._eventsCount = offFacebookEvents.length;

        const offFacebookEntities = await polyIn.select({
            predicate: dataFactory.namedNode(
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
            ),
            object: dataFactory.literal(OffFacebookEntity.name),
        });
        this._companiesCount = offFacebookEntities.length;

        this.active = this._companiesCount > 0;
    }

    render() {
        if (!this.active) {
            return "No off-facebook events detected in your export!";
        }
        return (
            "Found " +
            this._eventsCount +
            " events from " +
            this._companiesCount +
            " companies"
        );
    }
}
