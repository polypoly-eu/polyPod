const parentCategories = {
    social: "pppc:SocialData",
    technical: "pppc:TechnicalData",
    behavioral: "pppc:BehavioralData",
    financial: "pppc:FinancialData",
    personal: "pppc:PersonalData",
};

const categoryExplanation = {
    social: {
        de:
            "Soziale Daten sind solche, die mit den Beziehungen zwischen Menschen zu tun haben. Beispiele sind: Daten über Familienbeziehungen, Freundschaften oder die Verbindungen innerhalb sozialer Netzwerke.",
        en:
            "Social data is that which has to do with the relations between humans. Examples are: data about family relationships, friendships or the connections within social networks.",
    },
    technical: {
        de:
            "Technische Daten sind Daten über Wissenschaftliches oder Technisches. Dies können z.B. Daten von Sensoren, Gerätekennungen oder Informationen über Software auf einem Gerät sein.",
        en:
            "Technical data is data about something scientific or technological. This can be data from sensors, device identifiers or information about software on a device.",
    },
    behavioral: {
        de:
            'Verhaltensdaten sind Informationen, die sich auf die Handlungen einer Person beziehen. Das können Clickstream-Daten darüber sein, wie eine Person auf einer Website surft, ihr Gerät benutzt oder weitere Informationen als „diese Person hat dieses Jahr drei Urlaube gemacht".',
        en:
            'Behavioural data is information related to a person\'s actions. This can be clickstream data about how a person browses a website, uses their device, or something more like "this person went on 3 holidays this year."',
    },
    financial: {
        de:
            "Finanzdaten sind einfach alle Informationen, die sich auf den Kauf und Verkauf von Waren, sowie den Transfer von Geld beziehen. Das können auch Daten wie das Gehalt einer Person, ihre Kreditkartennummer oder ob sie ein Auto besitzt, sein.",
        en:
            "Financial data is simply any information that relates to the buying and selling of goods, the transfer of money for any reason from one party to another. This can also be data like a person's salary, their credit card number or whether they own a car.",
    },
    personal: {
        de: "MISSING: Category personal",
        en: "MISSING: Category personal",
    },
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
                    de: categoryExplanation.personal.de,
                    en: categoryExplanation.personal.en,
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: categoryExplanation.social.de,
                    en: categoryExplanation.social.en,
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: categoryExplanation.technical.de,
                    en: categoryExplanation.technical.en,
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: categoryExplanation.behavioral.de,
                    en: categoryExplanation.behavioral.en,
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: categoryExplanation.financial.de,
                    en: categoryExplanation.financial.en,
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
                    de: categoryExplanation.personal.de,
                    en: categoryExplanation.personal.en,
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: categoryExplanation.social.de,
                    en: categoryExplanation.social.en,
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: categoryExplanation.technical.de,
                    en: categoryExplanation.technical.en,
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: categoryExplanation.behavioral.de,
                    en: categoryExplanation.behavioral.en,
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: categoryExplanation.financial.de,
                    en: categoryExplanation.financial.en,
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
                    de: categoryExplanation.personal.de,
                    en: categoryExplanation.personal.en,
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: categoryExplanation.social.de,
                    en: categoryExplanation.social.en,
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: categoryExplanation.technical.de,
                    en: categoryExplanation.technical.en,
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: categoryExplanation.behavioral.de,
                    en: categoryExplanation.behavioral.en,
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: categoryExplanation.financial.de,
                    en: categoryExplanation.financial.en,
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
    "GOOGLE LLC": {
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
                    de: categoryExplanation.personal.de,
                    en: categoryExplanation.personal.en,
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: categoryExplanation.social.de,
                    en: categoryExplanation.social.en,
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: categoryExplanation.technical.de,
                    en: categoryExplanation.technical.en,
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: categoryExplanation.behavioral.de,
                    en: categoryExplanation.behavioral.en,
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: categoryExplanation.financial.de,
                    en: categoryExplanation.financial.en,
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
                    de: categoryExplanation.personal.de,
                    en: categoryExplanation.personal.en,
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: categoryExplanation.social.de,
                    en: categoryExplanation.social.en,
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: categoryExplanation.technical.de,
                    en: categoryExplanation.technical.en,
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: categoryExplanation.behavioral.de,
                    en: categoryExplanation.behavioral.en,
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: categoryExplanation.financial.de,
                    en: categoryExplanation.financial.en,
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
                    de: categoryExplanation.personal.de,
                    en: categoryExplanation.personal.en,
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: categoryExplanation.social.de,
                    en: categoryExplanation.social.en,
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: categoryExplanation.technical.de,
                    en: categoryExplanation.technical.en,
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: categoryExplanation.behavioral.de,
                    en: categoryExplanation.behavioral.en,
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: categoryExplanation.financial.de,
                    en: categoryExplanation.financial.en,
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
                    de: categoryExplanation.personal.de,
                    en: categoryExplanation.personal.en,
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
                explanation: {
                    de: categoryExplanation.social.de,
                    en: categoryExplanation.social.en,
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de: categoryExplanation.technical.de,
                    en: categoryExplanation.technical.en,
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
                explanation: {
                    de: categoryExplanation.behavioral.de,
                    en: categoryExplanation.behavioral.en,
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
                explanation: {
                    de: categoryExplanation.financial.de,
                    en: categoryExplanation.financial.en,
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
