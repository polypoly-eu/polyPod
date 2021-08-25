import { OffFacebookEntity, OffFacebookEvent } from "./model";

const namespace = "http://polypoly.coop/schema/fbImport/";

function findTripleValue(type, triples) {
    const triple = triples.find((triple) => triple.predicate.value === type);
    return triple ? triple.object.value : null;
}

export async function loadModel(pod, facebookAccount) {
    const { dataFactory, polyIn } = pod;

    const offFacebookEntitiesTriples = await polyIn.select({
        predicate: dataFactory.namedNode(
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        ),
        object: dataFactory.literal(OffFacebookEntity.name),
    });

    var offFacebookCompaniesById = [];
    for (const typeTripple of offFacebookEntitiesTriples) {
        const companyTripples = await polyIn.select({
            subject: typeTripple.subject,
        });
        const company = new OffFacebookEntity();
        company.importFromTriples(companyTripples);

        offFacebookCompaniesById[company.uuid] = company;
    }

    facebookAccount.offFacebookCompanies = Object.values(
        offFacebookCompaniesById
    );

    const offFacebookEventsTriples = await polyIn.select({
        predicate: {
            value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        },
        object: { value: OffFacebookEvent.name },
    });

    for (const typeTripple of offFacebookEventsTriples) {
        const eventTriples = await polyIn.select({
            subject: typeTripple.subject,
        });
        const event = new OffFacebookEvent();
        event.importFromTriples(eventTriples);

        const companySubjectValue = findTripleValue(
            `${namespace}offFacebookEntity`,
            eventTriples
        );
        const companyId = companySubjectValue.split("/").slice(-1);
        const company = offFacebookCompaniesById[companyId];
        event.offFacebookEntity = company;
        company.addOffFacebookEvent(event);
    }
}
