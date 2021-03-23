const parentCategories = {
    social: "Soziale Daten",
    technical: "Technische Daten",
    behavioral: "Verhaltensdaten",
    financial: "Wirtschaftliche Daten",
};

export default {
    "SCHUFA Holding AG": {
        dataTypeCorrelation: {
            types: [
                "dpv:BrowsingReferral",
                "dpv:BrowserFingerprint",
                "dpv:IPAddress",
            ],
            explanation: {
                de: "MISSING",
            },
        },
        dataTypeCategories: {
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSINg",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING",
                },
            },
        },
    },
    "APPLE INC.": {
        dataTypeCorrelation: {
            types: [
                "dpv:VoiceCommunicationRecording",
                "dpv:PhysicalAddress",
                "dpv:MentalHealth",
            ],
            explanation: {
                de: "MISSING",
            },
        },
        dataTypeCategories: {
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSINg",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING",
                },
            },
        },
    },
    "Bayerische Motoren Werke Aktiengesellschaft": {
        dataTypeCorrelation: {
            types: ["dpv:IPAddress", "dpv:GPSCoordinate", "dpv:Interest"],
            explanation: {
                de: "MISSING",
            },
        },
        dataTypeCategories: {
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSINg",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING",
                },
            },
        },
    },
    "ALPHABET INC.": {
        dataTypeCorrelation: {
            types: [
                "dpv:GeneralReputation",
                "dpv:TelephoneNumber",
                "dpv:GPSCoordinate",
            ],
            explanation: {
                de: "MISSING",
            },
        },
        dataTypeCategories: {
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSINg",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING",
                },
            },
        },
    },
    "Amazon Europe Core SARL": {
        dataTypeCorrelation: {
            types: ["dpv:CreditRecord", "dpv:Language", "dpv:BrowsingBehavior"],
            explanation: {
                de: "MISSING",
            },
        },
        dataTypeCategories: {
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSINg",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING",
                },
            },
        },
    },
    "FACEBOOK, INC": {
        dataTypeCorrelation: {
            types: ["dpv:TelephoneNumber", "dpv:LifeHistory", "dpv:Biometric"],
            explanation: {
                de: "MISSING",
            },
        },
        dataTypeCategories: {
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSINg",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING",
                },
            },
        },
    },
    "PAYPAL, INC.": {
        dataTypeCorrelation: {
            types: ["dpv:OfficialID", "dpv:TelephoneNumber", "dpv:Transaction"],
            explanation: {
                de: "MISSING",
            },
        },
        dataTypeCategories: {
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSINg",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING",
                },
            },
        },
    },
};
