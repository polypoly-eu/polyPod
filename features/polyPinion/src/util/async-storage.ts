const namespace = "http://polypoly.coop/schema/polyPinion/#";
const questionnairePredicate = "answers";
const indexPredicate = "this does not make sense";
const { dataFactory, polyIn } = window.pod;

const AsyncStorage = {
    async getItem(key: string): Promise<string | null> {
        // use non empty matcher when implemented in pod.js
        const quads = await polyIn.select({});
        return (
            quads.find(
                ({ subject, predicate }) =>
                    subject.value === `${namespace}${key}` &&
                    predicate.value === `${namespace}answers`
            )?.object || null
        );
    },

    async setItem(key: string, value: string): Promise<void> {
        const quad = dataFactory.quad(
            dataFactory.literal(`${namespace}${key}`),
            dataFactory.literal(`${namespace}${questionnairePredicate}`),
            dataFactory.literal(`${namespace}${value}`)
        );
        polyIn.add(quad);
    },

    async getIndex(key: string): Promise<string | null> {
        // use non empty matcher when implemented in pod.js
        const quads = await polyIn.select({});
        return (
            quads.find(
                ({ subject, predicate }) =>
                    subject.value === `${namespace}${key}` &&
                    predicate.value === `${namespace}answers`
            )?.object.value || null
        );
    },

    async setIndex(key: string, value: string): Promise<void> {
        const quad = dataFactory.quad(
            dataFactory.literal(`${namespace}${key}`),
            dataFactory.literal(`${namespace}${indexPredicate}`),
            dataFactory.literal(`${namespace}${value}`)
        );
        polyIn.add(quad);
    },
};

export default AsyncStorage;
