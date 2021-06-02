import { Tab, TabsLine } from "./src/tabs";
import {
  MarkdownRender,
  MarkdownRequester,
  MarkdownReader,
} from "./src/markdown-reader";
import { FirstCapitalize } from "./src/text-effects";

window.customElements.define("poly-tab", Tab);
window.customElements.define("poly-tabs", TabsLine);
window.customElements.define("poly-markdown-render", MarkdownRender);
window.customElements.define("poly-first-capitalize", FirstCapitalize);
window.customElements.define("poly-markdown-requester", MarkdownRequester);
window.customElements.define("poly-markdown-reader", MarkdownReader);
