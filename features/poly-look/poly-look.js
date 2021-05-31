import { Tab, TabsLine } from "./src/tabs";
import { MarkdownRender } from "./src/markdown-reader";
import { FirstCapitalize } from "./src/text-effects";

window.customElements.define("poly-tab", Tab);
window.customElements.define("poly-tabs", TabsLine);
window.customElements.define("poly-markdown-reader", MarkdownRender);
window.customElements.define("poly-first-capitalize", FirstCapitalize);
