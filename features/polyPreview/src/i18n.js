import { createI18n } from "@polypoly-eu/silly-i18n";
const {i18n } = await createI18n(["common"], ["en", "de"], "./locales");
export default i18n;
