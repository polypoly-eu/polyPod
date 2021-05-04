import Lexicon from "./Lexicon.svelte";
import lexiconData from "./data/lexicon.json";

const lexicon = new Lexicon({
    target: document.body,
    props: {
        data: lexiconData,
    },
});

export default lexicon;
