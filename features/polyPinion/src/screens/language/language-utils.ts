// hacky stuff
export async function getStoredLanguage() {
    return "de";
}

export const getStoredOrPhoneLanguageCode = async function () {
    return "de";
};

export const storeLanguage = async function (_languageCode: string) {
    // TOFIX: do we really want to return here?
    return;
};
