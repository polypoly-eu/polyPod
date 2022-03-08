import { LANGUAGE_AND_LOCALE_DATA_KEY } from "../../src/model/importers/language-and-locale-importer";

export const LANGUAGE_SETTINGS_LOCALE = {
    en: {
        selectedLanguage: {
            generic: {
                name: "Language Settings",
                description: "Your preferred language settings",
            },
            selected: {
                name: "Selected Language",
                description:
                    "The language you've chosen for your Facebook experience",
            },
            changes: {
                name: "Locale Changes",
                description: "The history of changes to your locale setting",
            },
        },
        videoLanguage: {
            name: "Preferred Language for Videos",
            description:
                "The preferred language for videos as determined by videos you've previously viewed",
        },
        knownLanguages: {
            name: "Languages You May Know",
            description:
                "Languages you may know as determined by your activity on Facebook",
        },
        preferredLanguage: {
            name: "Preferred Language",
            description:
                "Your preferred languages as determined by your activity on Facebook",
        },
    },
    de: {
        selectedLanguage: {
            generic: {
                name: "Spracheinstellungen",
                description: "Deine Spracheinstellungen",
            },
            selected: {
                name: "Ausgewählte Sprache",
                description:
                    "Die Sprache, die du für dein Facebook-Profil festgelegt hast",
            },
            // Manual translation
            changes: {
                name: "Gebietsschemaänderungen",
                description:
                    "Der Verlauf der Änderungen an Ihren Gebietsschemaeinstellungen.",
            },
        },
        videoLanguage: {
            name: "Bevorzugte Sprache für Videos",
            description:
                "Deine bevorzugte Sprache für Videos, basierend auf den von dir angesehenen Videos",
        },
        knownLanguages: {
            name: "Sprachen, die du vielleicht sprichst",
            description:
                "Sprachen, die du vielleicht sprichst - basierend auf deinen Aktivitäten auf Facebook",
        },
        preferredLanguage: {
            name: "Bevorzugte Sprache",
            description:
                "Deine bevorzugten Sprachen - basierend auf deinen Aktivitäten auf Facebook",
        },
    },
    da: {
        selectedLanguage: {
            generic: {
                name: "Sprogindstillinger",
                description: "Dine foretrukne sprogindstillinger",
            },
            selected: {
                name: "Valgt sprog",
                description:
                    "Det sprog, du har valgt til din Facebook-oplevelse",
            },
            //Manual translation
            changes: {
                name: "Lokale ændringer",
                description: "Historien om ændringer af din lokale indstilling",
            },
        },
        //Manual translation
        videoLanguage: {
            name: "Foretrukket sprog til videoer",
            description:
                "Det foretrukne sprog for videoer bestemt af videoer, du tidligere har set",
        },
        knownLanguages: {
            name: "Sprog, du måske kender",
            description:
                "Sprog, du måske kender, baseret på din aktivitet på Facebook",
        },
        preferredLanguage: {
            name: "Foretrukne sprog",
            description:
                "Dine foretrukne sprog ud fra din aktivitet på Facebook ",
        },
    },
};

export function createLocaleData(
    {
        selectedLanguage,
        localeChanges,
        videoLanguage,
        knownLanguages,
        preferredLanguage,
    },
    languageCode
) {
    const languageData = LANGUAGE_SETTINGS_LOCALE[languageCode];
    let localeData = [];
    if (selectedLanguage) {
        let children = [
            {
                name: languageData.selectedLanguage.selected.name,
                description:
                    languageData.selectedLanguage.selected.descriptions,
                entries: [
                    {
                        data: {
                            value: selectedLanguage,
                        },
                    },
                ],
            },
        ];
        if (localeChanges) {
            children.push({
                name: languageData.selectedLanguage.changes.name,
                description: languageData.selectedLanguage.changes.descriptions,
                entries: localeChanges.map((localeChange) => {
                    return {
                        timestamp: localeChange.timestamp,
                        data: {
                            name: localeChange.locale,
                        },
                    };
                }),
            });
        }
        localeData.push({
            name: languageData.selectedLanguage.generic.name,
            description: languageData.selectedLanguage.generic.description,
            children: children,
        });
    }

    if (videoLanguage) {
        localeData.push({
            name: languageData.videoLanguage.name,
            description: languageData.videoLanguage.description,
            entries: [
                {
                    data: {
                        value: videoLanguage,
                    },
                },
            ],
        });
    }

    if (knownLanguages) {
        localeData.push({
            name: languageData.knownLanguages.name,
            description: languageData.knownLanguages.description,
            entries: knownLanguages.map((knownLanguage) => {
                return {
                    data: {
                        value: knownLanguage,
                    },
                };
            }),
        });
    }

    if (preferredLanguage) {
        localeData.push({
            name: languageData.preferredLanguage.name,
            description: languageData.preferredLanguage.description,
            entries: [
                {
                    data: {
                        value: preferredLanguage,
                    },
                },
            ],
        });
    }

    return { [LANGUAGE_AND_LOCALE_DATA_KEY]: localeData };
}

export function createLanguageSettingsData(
    mainLanguage,
    secondLanguage,
    translationLanguage
) {
    return createLocaleData(
        {
            selectedLanguage: mainLanguage,
            localeChanges: [
                { locale: mainLanguage, timestamp: 1416284503 },
                { locale: secondLanguage, timestamp: 1516284503 },
            ],
            videoLanguage: mainLanguage.substr(0, mainLanguage.indexOf("_")),
            knownLanguages: [
                mainLanguage.substr(0, mainLanguage.indexOf("_")),
                secondLanguage.substr(0, secondLanguage.indexOf("_")),
            ],
            preferredLanguage: mainLanguage,
        },
        translationLanguage
    );
}
