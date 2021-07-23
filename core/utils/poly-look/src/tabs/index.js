import { TabContent } from "./tabContent";
import { Tab } from "./tab";
import { TabHeader } from "./tabHeader";
import { Tabs } from "./tabs";
import { polyPrefix } from "../globalTheme";

window.customElements.define(`${polyPrefix}-tab-content`, TabContent);
window.customElements.define(`${polyPrefix}-tab-header`, TabHeader);
window.customElements.define(`${polyPrefix}-tab`, Tab);
window.customElements.define(`${polyPrefix}-tabs`, Tabs);
