import LexiconView from "./Lexicon.svelte";
import lexiconData from "./data/lexicon.json";
import Lexicon from "./Lexicon.js";

//Take this from polyPod
const language = "en";

const lexicon = new LexiconView({
    target: document.body,
    props: {
        lexicon: new Lexicon(language, lexiconData),
    },
});

export default lexicon;
