const namespace = "http://polypoly.coop/schema/polyPinion/#";
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
            dataFactory.namedNode(`${namespace}${key}`),
            dataFactory.namedNode(`${namespace}answers`),
            dataFactory.namedNode(`${namespace}${value}`)
        );
        polyIn.add(quad);
    },
};

export default AsyncStorage;
