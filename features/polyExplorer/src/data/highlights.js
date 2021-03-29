const parentCategories = {
    social: "pppc:SocialData",
    technical: "pppc:TechnicalData",
    behavioral: "pppc:BehavioralData",
    financial: "pppc:FinancialData",
    personal: "pppc:PersonalData",
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
                de: "MISSING: Korrelationsbeschreibung",
            },
        },
        dataTypeCategories: {
            [parentCategories.personal]: {
                category: "dpv:Age",
                explanation: {
                    de: "MISSING: Alter-Beschreibung",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING: Sprache-Beschreibung",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING: Browser-Fingerprint Beschreibung",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSING: Surfverhalten-Beschreibung",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING: Finanz-Beschreibung",
                },
            },
        },
        dataRecipient: {
            name: "Microsoft Corporation (US)",
            companyExplanation: {
                de:
                    "Die Microsoft Corporation ist ein internationaler Hard- und Softwareentwickler und ein Technologieunternehmen mit Hauptsitz in Redmond (USA) und gehört ebenfalls zu den Big-Five-Unternehmen, also den größten Tech-Konzernen der Welt.",
                en:
                    "Microsoft Corporation is an international hardware and software developer and a technology company headquartered in Redmond (USA) and is also one of the Big Five companies, i.e. the largest tech corporations in the world.",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung für Microsofts Industrie.",
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
                de: "MISSING: Korrelationsbeschreibung",
            },
        },
        dataTypeCategories: {
            [parentCategories.personal]: {
                category: "dpv:Age",
                explanation: {
                    de: "MISSING: Alter-Beschreibung",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING: Sprach-Beschreibung",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING: Browser-Fingerprint Beschreibung",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSING: Surf-Verhalten Beschreibung",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING: Finanz-Beschreibung",
                },
            },
        },
        dataRecipient: {
            name: "IBM (US)",
            companyExplanation: {
                de:
                    "IBM ist eines der weltweit führenden Unternehmen – insbesondere für branchenspezifische Lösungen und Dienstleistungen – im IT-, Software- und Hardware-Bereich. Der Unternehmenssitz ist in Armonk (USA).",
                en:
                    "IBM is one of the world's leading companies - especially for industry-specific solutions and services - in the IT, software and hardware sectors. The company is headquartered in Armonk (USA).",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung für IBMs Kategorie",
            },
        },
    },
    "Bayerische Motoren Werke Aktiengesellschaft": {
        dataTypeCorrelation: {
            types: ["dpv:IPAddress", "dpv:GPSCoordinate", "dpv:Interest"],
            explanation: {
                de: "MISSING: Korrelationsbeschreibung",
            },
        },
        dataTypeCategories: {
            [parentCategories.personal]: {
                category: "dpv:Age",
                explanation: {
                    de: "MISSING: Alter-Beschreibung",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING: Sprach-Beschreibung",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING: Browser-Fingerprint Beschreibung",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSING: Surfverhalten-Beschreibung",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING: Finanz-Beschreibung",
                },
            },
        },
        dataRecipient: {
            name: "BOSCH Service Solutions GmbH (DE)",
            companyExplanation: {
                de:
                    "Bosch Service Solutions ist ein führender Anbieter für Business Process Outsourcing. Bosch Service Solutions  unterstützt bei der Prozessoptimierung mit fünf Kernbereichen: Customer Experience Services, Mobility Services, Monitoring Services und Business Services. Der Firmensitz ist Stuttgart (DE).",
                en:
                    "Bosch Service Solutions is a leading provider of Business Process Outsourcing. Bosch Service Solutions supports process optimisation with five core areas: Customer Experience Services, Mobility Services, Monitoring Services and Business Services. The company is headquartered in Stuttgart (DE).",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung für Boschs Industrie.",
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
                de: "MISSING: Korrelationsbeschreibung",
            },
        },
        dataTypeCategories: {
            [parentCategories.personal]: {
                category: "dpv:Age",
                explanation: {
                    de: "MISSING: Alter-Beschreibung",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING: Sprach-Beschreibung",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING: Browser-Fingerprint Beschreibung",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSING: Surfverhalten-Beschreibung",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING: Finanz-Beschreibung",
                },
            },
        },
        dataRecipient: {
            name: "Waytogrow",
            companyExplanation: {
                de:
                    "Waytogrow ist eine unabhängige Gruppe von Expert:innen, die sich auf programmatische und datengesteuerte Werbung spezialisiert haben. Waytogrow mit Sitz in Warschau (PL) gehört zur Netsprint-Gruppe, einem führenden Unternehmen im digitalen Marketing. ",
                en:
                    "Waytogrow is an independent group of experts specialising in programmatic and data-driven advertising. Waytogrow, based in Warsaw (PL), is part of the Netsprint Group, a leading digital marketing company.",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung von Waytogrows Industrie",
            },
        },
    },
    "Amazon Europe Core SARL": {
        dataTypeCorrelation: {
            types: ["dpv:CreditRecord", "dpv:Language", "dpv:BrowsingBehavior"],
            explanation: {
                de: "MISSING: Korrelationsbeschreibung",
            },
        },
        dataTypeCategories: {
            [parentCategories.personal]: {
                category: "dpv:Age",
                explanation: {
                    de: "MISSING: Alter-Beschreibung",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING: Sprach-Beschreibung",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING: Browser-Fingerprint Beschreibung",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSING: Surfverhalten-Beschreibung",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING: Finanz-Beschreibung",
                },
            },
        },
        dataRecipient: {
            name: "Zeotap GmbH",
            companyExplanation: {
                de:
                    "MISSING: Sollte Nielsen LLC sein, aber Nielsen fehlt noch.",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung für Nielsens Industrie",
            },
        },
    },
    "FACEBOOK, INC": {
        dataTypeCorrelation: {
            types: ["dpv:TelephoneNumber", "dpv:LifeHistory", "dpv:Biometric"],
            explanation: {
                de: "MISSING: Korrelationsbeschreibung",
            },
        },
        dataTypeCategories: {
            [parentCategories.personal]: {
                category: "dpv:Age",
                explanation: {
                    de: "MISSING: Alter-Beschreibung",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING: Sprach-Beschreibung",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING: Browser-Fingerprint Beschreibung",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSING: Surfverhalten-Beschreibung",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING: Finanz-Beschreibung",
                },
            },
        },
        dataRecipient: {
            name: "University College London",
            companyExplanation: {
                de:
                    "Das University College London (UK) gehört zur Universität London und ist als Mitglied der Russell-Gruppe (Verbund 24 führender, britischer Forschungsuniversitäten) eine der angesehensten Eliteuniversitäten der Welt.",
                en:
                    "University College London (UK) is part of the University of London and, as a member of the Russell Group (an association of 24 leading British research universities), is one of the most prestigious elite universities in the world.",
            },
            industryExplanation: {
                de:
                    "MISSING: Beschreibung für University College Londons Industrie",
            },
        },
    },
    "PayPal (Europe) S.à r.l. et Cie, S.C.A.": {
        dataTypeCorrelation: {
            types: ["dpv:OfficialID", "dpv:TelephoneNumber", "dpv:Transaction"],
            explanation: {
                de: "MISSING: Korrelationsbeschreibung",
            },
        },
        dataTypeCategories: {
            [parentCategories.personal]: {
                category: "dpv:Age",
                explanation: {
                    de: "MISSING: Alter-Beschreibung",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: "MISSING: Sprach-Beschreibung",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: "MISSING: Browser-Fingerprint Beschreibung",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: "MISSING: Surfverhalten-Beschreibung",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: "MISSING: Finanz-Beschreibung",
                },
            },
        },
        dataRecipient: {
            name: "1000Mercis Ltd (GB)",
            companyExplanation: {
                de:
                    "MISSING: Sollte Alphabet sein, aber Alphabet ist (noch?) nicht in der Liste.",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung für Alphabets Industrie.",
            },
        },
    },
};
