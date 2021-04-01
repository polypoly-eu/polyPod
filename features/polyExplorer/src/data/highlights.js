const parentCategories = {
    social: "pppc:SocialData",
    technical: "pppc:TechnicalData",
    behavioral: "pppc:BehavioralData",
    financial: "pppc:FinancialData",
    individual: "pppc:IndividualData",
};

export default {
<<<<<<< Updated upstream
=======
    "pc polypoly coop SCE mbH": {
        dataTypeCorrelation: {
            types: ["dpv:OfficialID", "dpv:TelephoneNumber", "dpv:Transaction"],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die aus den einzelnen gemeinsam genutzten Datenpunkten allein nicht möglich wären. polypoly legt Wert darauf, dass auch mit den rechtlichen Vorgaben, die eine Genossenschaft mit sich bringen, so wenige persönliche Daten eines Mitglieds wie möglich gesammelt werden, um keine Rückschlüsse auf Mitglieder zu ziehen – weder persönlich noch werblich.",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. polypoly attaches importance to collecting as little personal data of a member as possible, even with the legal requirements that a cooperative entail, in order not to draw any conclusions about members - neither personally nor for advertising purposes.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:OfficialID",
                explanation: {
                    de:
                        "Gemäß der Satzung der polypoly-Genossenschaft muss jede Person, die Mitglied wird, die Staatsangehörigkeit eines EU-Mitgliedsstaates besitzen. Zu diesem Zweck fragt polypoly die Mitglieder im Rahmen ihres Antrags nach ihrer Staatsangehörigkeit.",
                    en:
                        "According to the statutes of the polypoly cooperative, anyone who becomes a member must have the citizenship of an EU member state. For this purpose we ask members their nationality as part of their application.",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:DeviceSoftware",
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
            },
            // TODO: dpv:Financial doesn't exist for polypoly
            /*
            [parentCategories.financial]: {
                category: "dpv:Financial",
            },
            */
        },
        dataRecipient: {
            name: "elopage GmbH (DE)",
            companyExplanation: {
                de:
                    "Die elopage GmbH mit Sitz in Berlin (DE) bietet Onlinelösungen für eigene Bezahlseiten, die Erstellung der Produkte und Upsells in einem Tool.",
                en:
                    "elopage GmbH, based in Berlin (DE), offers online solutions for own payment pages, the creation of products and upsells in one tool.",
            },
            industryExplanation: {
                de:
                    "polypoly nutzt verschiedene Dienstleistende, um das Tagesgeschäft als Genossenschaft zu betreiben. Der Prozess, Mitglied zu werden, ist dadurch um ein Vieles einfacher und skalierbarer gestaltet. Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "polypoly uses various service providers in order to run their business day to day. The process of becoming a member is designed to be scalable yet simple and can be performed from the comfort of any device capable of browsing the internet. Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
>>>>>>> Stashed changes
    "SCHUFA Holding AG": {
        dataTypeCorrelation: {
            types: [
                "dpv:LifeHistory",
                "dpv:Financial",
                "dpv:GeneralReputation",
            ],
            explanation: {
                de:
                    "<p>Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.</p><p>Die Schufa sammelt Daten aus allen möglichen Quellen und nutzt sie, um festzustellen, ob ein Unternehmen oder eine Person kreditwürdig ist – also wahrscheinlich ihren Kreditvertrag erfüllen wird. Wie die Schufa zu diesen Ergebnissen kommt, bleibt jedoch ein Geheimnis und kann für diejenigen, die einen negativen Score erhalten, unglaublich ungerecht erscheinen und zu ungeahnten Problemen führen.</p>",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. Schufa collects data from all kinds of sources and uses it to determine whether a business or a person is credit worthy - likely to honour their loan agreement. How they reach these conclusions however remains a mystery and for those on the receiving end of negative scores, can seem incredibly unjust.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
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
                en: "",
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
                de:
                    "<p>Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.</p><p>Apple hat Zugriff auf eine Menge sehr sensibler persönlicher Daten und gibt an, dass sie diese mit Regierungsbehörden in den USA zum Zweck der nationalen Sicherheit teilen – was natürlich Sinn ergibt, aber möglicherweise nicht gut bei politisch aktiven Personen ankommt, die nicht mit all den Dingen einverstanden sind, die die USA im Namen der besagten nationalen Sicherheit tun.</p>",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. Apple does have access to a lot of very sensitive personal data and they state that they share this with Government agencies in the US for the purpose of national security - which of course makes sense, but might not sit well with politically sensitive individuals who don't agree with all the things the US does in the name of said national security.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:GPSCoordinate",
                explanation: {
                    de:
                        "<p>Apple verwendet die Standortdaten des Geräts, um u.a. die Dienste wie Echtzeit-Verkehr, Karten und Find my Phone bereitzustellen. Wenn ein:e Benutzer:in die Standortdienste einschaltet, können verschiedene Sensoren den Aufenthaltsort eines Geräts bis auf wenige Meter genau bestimmen.</p><p>In der Vergangenheit führte das iPhone 11 z.B. regelmäßige Standortprüfungen durch, um festzustellen, ob es sich in einem Land befand, in dem die Verwendung einer neuen Ultra-Wide-Band-Datenübertragungstechnologie genehmigt war. Benutzer:innen können diese Funktion und Suche nicht ausstellen, die nur dann automatisch deaktiviert wird, wenn sich das Gerät an einem Ort befindet, wo diese Technologie noch nicht verfügbar ist.</p>",
                    en:
                        "<p>Apple uses device location data to provide its services like realtime traffic, maps and Find my Phone, among others. If a user turns on location services, various sensors can pinpoint the whereabouts of a device to within a few metres.</p><p>In the past, the iPhone 11 made regular location checks to determine if it was in a country where the use of a new Ultra Wide Band data transfer technology was approved, something that couldn't be turned off by the user - unless by travelling to a location where it would become automatically disabled.</p>",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:Location",
                explanation: {
                    de:
                        "Apple verwendet die von Kund:innen-Verhalten gesammelten Daten und wie sie ihre Geräte verwenden, um stetige Produktverbesserungen anzustreben und die Forschung und Entwicklung zukünftiger Produkte und Dienste zu informieren. Dies geschieht auch, wenn Konten speziell für Kinder eingerichtet werden. ",
                    en:
                        "Apple uses the data it gathers about the behaviour of its customers - how they use their devices - to inform product improvement and the research and development of future products and services. This happens also if accounts are set up specifically for children. ",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
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
    },
    "Bayerische Motoren Werke Aktiengesellschaft": {
        dataTypeCorrelation: {
            types: ["dpv:IPAddress", "dpv:GPSCoordinate", "dpv:Interest"],
            explanation: {
                de:
                    "<p>Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.</p><p>BMW möchte keine Gelegenheit verpassen, Menschen zum Kauf eines ihrer Fahrzeuge zu bewegen, und durch die gemeinsame Nutzung mehrerer Datentypen kann BMW die Überzeugungskraft der Verkaufsbemühungen maximieren. Auf diese Weise wurden die Techniken von Gebrauchtwagenverkaufenden, die dies früher in persona taten, automatisiert und in ein scheinbar privateres Browsing-Erlebnis eingebettet.</p>",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. BMW wouldn't want to miss an opportunity to try and encourage someone to purchase one of their vehicles and by sharing multiple datatypes they can maximise the persuasiveness of their sales efforts. In this way, the techniques of a used car salesman who previously at least did this to your face, have been automated and embedded in what seems like a more private browsing experience. ",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
            },
            [parentCategories.behavioral]: {
                category: "dpv:Tracking",
                explanation: {
                    de:
                        "BMW verwendet auf der Website Cookies, die das Verhalten der Nutzer:innen beim Surfen verfolgen und die kombiniert werden, um Nutzende bei späteren Besuchen wiederzuerkennen und das Verhalten im Zeitverlauf abzubilden. Die Daten, die aus diesem Prozess gewonnen werden, können Dinge sein, wie das bestimmte Automodell, das eine Person am häufigsten angesehen hat, oder die Fahrzeugklasse, mit der sie die meiste Zeit verbringt. BMW teilt solche Daten mit Unternehmen wie Sophus 3 – einem Unternehmen, das sich auf das Kaufverhalten von Autos spezialisiert hat und mit vielen großen Herstellenden zusammenarbeitet.",
                    en:
                        "BMW uses cookies on its website that track the behaviour of users as they browse and that are combined to recognise users on subsequent visits and map behaviour over time. The data garnered from this process can be things like the particular model of car that a person has viewed most, or the class of vehicles they spend most time engaging with. BMW shares data such as this with companies like Sophus 3 - a company that specialises in car buying behaviour and works with many major manufacturers.",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
            },
        },
        dataRecipient: {
            name: "BOSCH Service Solutions GmbH (DE)",
            companyExplanation: {
                de:
                    "Bosch Service Solutions ist ein führender Anbieter für Business Process Outsourcing. Der Firmensitz ist Stuttgart (DE).",
                en:
                    "Bosch Service Solutions is a leading provider of Business Process Outsourcing. The company is headquartered in Stuttgart (DE).",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung für Boschs Industrie.",
            },
        },
    },
    "Google LLC": {
        dataTypeCorrelation: {
            types: [
                "dpv:GeneralReputation",
                "dpv:TelephoneNumber",
                "dpv:GPSCoordinate",
            ],
            explanation: {
                de:
                    "<p>Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.</p><p>Als Unternehmen, das u.a. Geld durch die Zusammenarbeit mit Werbetreibenden verdient, ist Google an allen Informationen interessiert, die Aufschluss über die Effektivität der eigens verkauften Dienstes geben können. Die Bestimmung des Standorts einer Person zu einem bestimmten physischen Geschäft kann auf das Interesse an bestimmten Produkten hindeuten, die aus anderen Quellen bestätigt und verwendet werden können. Diese konkreten Daten können dann an Werbetreibenden weiter verkauft werden, die versuchen, das Verbraucher:innen-Verhalten auf einer immer granulareren Ebene zu beeinflussen.</p>",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. As an advertising company, Google is interested in any information that can inform the effectiveness of the service they are selling. Determining a person's location to a particular physical store can indicate interest in certain products that can be corroborated from other sources and used to sell access to advertisers who are attempting to influence consumer behaviour on an ever more granular level. ",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
                explanation: {
                    de: "Missing: Personal data",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:GPSCoordinate",
                explanation: {
                    de:
                        "<p>Google macht aus verschiedenen Gründen Gebrauch von GPS-Koordinaten – nicht zuletzt, um die genauere Ausrichtung von Werbung auf Menschen innerhalb eines bestimmten geografischen Gebiets zu ermöglichen. Es ist nicht mehr überraschend, wenn Menschen Werbung für Produkte sehen, die nur in der eigenen geografischen Nähe verfügbar sind – und so nützlich es auch ist, über lokale Produkte und nahegelegene Dienstleistungen zu erfahren, können punktgenaue Werbekampagnen Wahlen beeinflussen. Google verlangt bspw., dass jede politische Werbung, die in der EU gezeigt wird, einen klaren Hinweis darauf enthält, wer dafür bezahlt hat.</p><p>Ein weiteres Beispiel sind die Verkehrsstatistiken auf Google Maps, die ebenfalls auf der massenhaften Erfassung von Gerätestandortdaten und der Weitergabe an andere Nutzer:innen beruhen. Ein Bericht von Quartz aus dem Jahr 2017, der zeigte, dass Standortdaten, die aus der Nähe zu zahlreichen Mobilfunkmasten abgeleitet wurden, standardmäßig an Google übertragen wurden, selbst wenn die Standortdienste ausgeschaltet waren oder keine SIM-Karte eingelegt war. Dies führte dann zu einer Änderung der Datenpraktiken des Unternehmens.</p>",
                    en:
                        "<p>Google makes use of GPS coordinates for various reasons – not least to enable the more precise targeting of advertising to people within a certain geographical area. It is no longer surprising when we see advertisements for products that are only available in our geographic proximity - and as useful as it is to hear about products and services available nearby, pinpoint ad campaigns can sway elections. Google does require that any political advertising shown in the EU comes with clear notice about who paid for it.</p><p>Another example is the traffic stats on Google maps thats also rely on the mass gathering of device location data and sharing with other users. A report by Quartz from 2017 showing that location data derived from proximity to numerous cell towers was being transmitted to Google by default even when location services were turned off or no SIM was inserted, led to a change in their data practices.</p>",
                },
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
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
<<<<<<< Updated upstream
                de: "MISSING: Beschreibung von Waytogrows Industrie",
=======
                de:
                    "Google rühmt sich, Partnerschaften mit über 2 Millionen Websites einzugehen, um Anzeigen auszuliefern. Ihre ausgefeilten Analysen, ihre tiefe Marktdurchdringung und ihr riesiges Partner:innen-Netzwerk in fast 100 Ländern machen die hochgranularen Ad-Targeting-Services möglich, die sie anbieten.",
                en:
                    "Google boasts partnering with over 2 million websites to display ads. Their sophisticated analytics, deep market penetration and vast partner network across nearly 100 countries, make the highly granular ad targeting services they offer possible.",
>>>>>>> Stashed changes
            },
        },
    },
    "Amazon Europe Core SARL": {
        dataTypeCorrelation: {
            types: ["dpv:CreditRecord", "dpv:Language", "dpv:BrowsingBehavior"],
            explanation: {
                de:
                    "<p>Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.</p><p>Im Fall von Amazon kann die ausgefeilte Messung des Nutzer:innen-Verhaltens und der Gewohnheiten verwendet werden, um wahrscheinliche Kund:innen für die neuesten Produkte des Unternehmens zu erkennen und sie automatisch mit Werbekampagnen im gesamten Web anzusprechen.</p>",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. In the case of Amazon, their sophisticated measurement of user behaviour and habits can be used to spot likely customers for its newest products and automatically target them across the web with advertising campaigns.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
                explanation: {
                    de: "Missing: Personal data",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
            },
            [parentCategories.behavioral]: {
                category: "dpv:PurchasesAndSpendingHabit",
                explanation: {
                    de:
                        "Amazon sammelt Daten darüber, wie Kund:innen den Service auf einer sehr granularen Ebene nutzen. Jeder Kauf, den ein:e Nutzer:in tätigt, wird natürlich protokolliert, aber nicht nur das – Amazon speichert auch Daten darüber, wann Nutzer:innen dazu neigen, Käufe zu tätigen, und was diese Käufe tendenziell sind. Je mehr solcher Daten sie haben, desto mehr Marketingkampagnen können individuell zugeschnitten werden. Wenn Amazon zum Beispiel protokolliert hat, dass Käufer:innen häufig Sonntagabend technische Gadgets einkaufen, dann kann Amazon in den Tagen davor eine Marketingkampagne über verschiedene Kanäle anbieten, um Nutzer:innen zu einem weiteren Kauf zu animieren – und es so zur Gewohnheit werden lassen, Menschen, zum Wochenendeinkauf zu verleiten.",
                    en:
                        "Amazon collects data about how customers use its service to a highly granular level. Each purchase made by a user is logged of course, but not only that - Amazon will store data about when users tend to make purchases, and what those purchases tend to be. The more data like these they have, more marketing campaigns can be individually tailored. For example if you've been logged as often shopping on a Sunday evening for gadgets, then Amazon can cater a marketing campaign across various channels in the days before - in order to prime you to make another purchase - and turn it into a habit.",
                },
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
            },
<<<<<<< Updated upstream
            dataRecipient: {
                name: "	Nielsen LLC",
                companyExplanation: {
                    de:
                        "Nielsen LLC ist der globale Marktführer im Bereich Marktforschung und hilft Unternehmen dabei, ihre Konsument:innen und deren Verhalten (besser) zu verstehen – durch qualitative und quantitative Konsument:innen-Befragungen. Der Unternehmenssitz ist in London (UK), das Verwaltungszentrum in New York City (USA).",
                    en:
                        "Nielsen LLC is the global leader in market research, helping companies (better) understand their consumers and their behaviour through qualitative and quantitative consumer surveys. The company is headquartered in London (UK) and has its administrative centre in New York City (USA). ",
                },
                industryExplanation: {
                    de: "MISSING: Beschreibung für Nielsens Industrie",
                },
=======
        },
        dataRecipient: {
            name: "Nielsen LLC (US)",
            companyExplanation: {
                de:
                    "Nielsen LLC ist der globale Marktführer im Bereich Marktforschung und hilft Unternehmen dabei, ihre Konsument:innen und deren Verhalten (besser) zu verstehen.",
                en:
                    "Nielsen LLC is the global leader in market research, helping companies (better) understand their consumers and their behaviour.",
            },
            industryExplanation: {
                de:
                    'Amazons Bemühungen, das „kund:innenorientierteste Unternehmen der Welt" zu werden, werden auch durch die Zusammenarbeit mit Marktforschunginstituten und anderen Unternehmen aus dieser Branche kontinuierlich verbessert.',
                en:
                    "Amazon's efforts to become the world's \"most customer focused company\" are fuelled by the research and analysis of customers and markets in a feedback loop of constant improvement.",
>>>>>>> Stashed changes
            },
        },
    },
    "FACEBOOK, INC": {
        dataTypeCorrelation: {
            types: ["dpv:TelephoneNumber", "dpv:LifeHistory", "dpv:Biometric"],
            explanation: {
                de:
                    "<p>Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.</p><p>Nur durch die gemeinsame Nutzung von Daten mit potenziellen Werbetreibenden kann Facebook die Nutzenden bis hin zu sehr feinen Spezifikationen ansprechen. Werbung ist nicht mehr etwas, das offen für alle sichtbar ist, sondern eine individuell zugeschnittene Nachricht, die darauf abzielt, die Personen zu beeinflussen, die für ihren Einfluss als empfänglich erachtet werden.</p>",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. Only by sharing data with prospective advertisers can Facebook target their users down to very finely detailed specifications. Advertising is no longer something that is openly visible for all to see, but individually bespoke messaging designed to influence the individuals deemed susceptible to its influence.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
            },
            [parentCategories.financial]: {
                category: "dpv:Financial",
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
            types: [
                "dpv:EmailAddress",
                "dpv:TelephoneNumber",
                "dpv:CreditCardNumber",
            ],
            explanation: {
                de:
                    "<p>Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.</p><p>Das Hacken von Menschen wird mit der Zeit immer alltäglicher und mit genügend Daten über eine Person ist es nicht allzu kompliziert, sich als diese auszugeben und ihr Geld zu stehlen. Rechtliche Konsequenzen für internationale Verbrechen, die aus der Ferne unter Verwendung von Daten aus verschiedenen Quellen durchgeführt werden, sind ebenfalls schwieriger zu untersuchen und bleiben oft ungestraft.</p>",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. People getting hacked is becoming more and more commonplace as time goes on and with enough data on some individual it isn't too complicated to impersonate them and to steal their money. Legal consequences for international crime performed remotely using data garnered from multiple sources is also harder to investigate and often goes unpunished. ",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
            },
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
            },
            [parentCategories.financial]: {
                category: "dpv:Transactional",
                explanation: {
                    de:
                        "Dass PayPal Daten über Geld und Finanzen sammelt und weitergibt, ist nicht überraschend. Was überraschen könnte oder hinterfragenswert erscheint, ist, warum sie solche Daten z.B. mit einem Empfehlungsmarketing-Unternehmen wie Extole teilen, angeblich zum Zweck der Betrugsprävention – ein Service, den Extole auf seiner Website jedoch nicht erwähnt.",
                    en:
                        "That PayPal collects and shares data relating to money and finances is not surprising. What might come as a surprise or seem worthwhile questioning, is why they share such data with a referral marketing company like Extole supposedly for fraud prevention purposes, a service Extole doesn't mention on its website.",
                },
            },
        },
        dataRecipient: {
            name: "Alphabet Inc.",
            companyExplanation: {
                de:
                    "Alphabet Inc. ist die Dachgesellschaft der Google LLC mit Sitz in Kalifornien (USA) und gehört als Technologie-Konzern zu einer der sog. Big-Five-Unternehmen, also den größten Tech-Konzernen der Welt.",
                en:
                    "Alphabet Inc. is the parent company of Google LLC, which is based in California (USA) and, as a technology group, belongs to one of the so-called Big Five companies, i.e. the largest tech groups in the world.",
            },
            industryExplanation: {
                de: "MISSING: Beschreibung für Alphabets Industrie.",
            },
        },
    },
};
