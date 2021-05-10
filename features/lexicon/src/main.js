import LexiconView from "./Lexicon.svelte";
import lexiconData from "./data/lexicon.json";
import Lexicon from "./Lexicon.js";
import { determineLanguage } from "@polypoly-eu/silly-i18n";

const lexicon = new LexiconView({
    target: document.body,
    props: {
        lexicon: new Lexicon(determineLanguage(), lexiconData),
    },
});

export default lexicon;
