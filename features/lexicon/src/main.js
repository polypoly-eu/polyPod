import "poly-look";

import LexiconView from "./Lexicon.svelte";
import lexiconData from "./data/lexicon.json";
import Lexicon from "./Lexicon.js";

const lexicon = new LexiconView({
    target: document.body,
    props: {
        lexicon: new Lexicon(lexiconData),
    },
});

export default lexicon;
