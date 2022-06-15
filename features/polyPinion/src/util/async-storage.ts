const namespace = "http://polypoly.coop/schema/polyPinion/#";
const questionnairePredicate = "answers";
const indexPredicate = "this does not make sense";
const { dataFactory, polyIn } = window.pod;

const AsyncStorage = {
    async getItem(key: string): Promise<string | null> {
        // use non empty matcher when implemented in pod.js
        const quads = await polyIn.match({});
        return (
            quads.find(
                ({ subject, predicate }) =>
                    subject.value === `${namespace}${key}` &&
                    predicate.value === `${namespace}${questionnairePredicate}`
            )?.object.value || null
        );
    },

    async setItem(key: string, value: string): Promise<void> {
        const quad = dataFactory.quad(
            dataFactory.literal(`${namespace}${key}`),
            dataFactory.literal(`${namespace}${questionnairePredicate}`),
            dataFactory.literal(`${value}`)
        );
        polyIn.add(quad);
    },

    //I really don't like this, needs some refactoring
    async getRecentAnswers(key: string): Promise<string | null> {
        // use non empty matcher when implemented in pod.js
        const quads = (await polyIn.match({})).filter(
            ({ subject, predicate }) =>
                subject.value === `${namespace}${key}` &&
                predicate.value === `${namespace}${questionnairePredicate}`
        );
        return quads[quads.length - 1]?.object.value;
    },

    async getIndex(key: string): Promise<string | null> {
        // use non empty matcher when implemented in pod.js
        const quads = await polyIn.match({});
        return (
            quads.find(
                ({ subject, predicate }) =>
                    subject.value === `${namespace}${key}` &&
                    predicate.value === `${namespace}${indexPredicate}`
            )?.object.value || null
        );
    },

    async setIndex(key: string, value: string): Promise<void> {
        const quad = dataFactory.quad(
            dataFactory.literal(`${namespace}${key}`),
            dataFactory.literal(`${namespace}${indexPredicate}`),
            dataFactory.literal(`${value}`)
        );
        polyIn.add(quad);
    },
};

export default AsyncStorage;
