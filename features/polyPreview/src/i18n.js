import { createI18n } from "@polypoly-eu/silly-i18n";
let i18n;
createI18n(["common"], ["en", "de"], "./locales").then( (data) => {console.log(data); i18n=data });
export default i18n;
