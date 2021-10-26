const parentCategories = {
    social: "pppc:SocialData",
    technical: "pppc:TechnicalData",
    behavioral: "pppc:BehavioralData",
    financial: "pppc:FinancialData",
    individual: "pppc:IndividualData",
};

export default {
    "pc polypoly coop SCE mbH (DE)": {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    "Schufa (DE)": {
        dataTypeCorrelation: {
            types: [
                "dpv:LifeHistory",
                "dpv:Financial",
                "dpv:GeneralReputation",
            ],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären.Die Schufa sammelt Daten aus allen möglichen Quellen und nutzt sie, um festzustellen, ob ein Unternehmen oder eine Person kreditwürdig ist – also wahrscheinlich ihren Kreditvertrag erfüllen wird. Wie die Schufa zu diesen Ergebnissen kommt, bleibt jedoch ein Geheimnis und kann für diejenigen, die einen negativen Score erhalten, unglaublich ungerecht erscheinen und zu ungeahnten Problemen führen.",
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
                de:
                    "Die SCHUFA gibt Website-Daten zu Werbe- und Analysezwecken an Unternehmen aus der IT-Branche weiter.",
                en:
                    "SCHUFA shares data with companies in the IT sector for advertising and analytics purposes.",
            },
        },
    },
    "Apple (US)": {
        dataTypeCorrelation: {
            types: [
                "dpv:VoiceCommunicationRecording",
                "dpv:PhysicalAddress",
                "dpv:MentalHealth",
            ],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären. Apple hat Zugriff auf eine Menge sehr sensibler persönlicher Daten und gibt an, dass sie diese mit Regierungsbehörden in den USA zum Zweck der nationalen Sicherheit teilen – was natürlich Sinn ergibt, aber möglicherweise nicht gut bei politisch aktiven Personen ankommt, die nicht mit all den Dingen einverstanden sind, die die USA im Namen der besagten nationalen Sicherheit tun.",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. Apple does have access to a lot of very sensitive personal data and they state that they share this with Government agencies in the US for the purpose of national security - which of course makes sense, but might not sit well with politically sensitive individuals who don't agree with all the things the US does in the name of said national security.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Location",
                explanation: {
                    de:
                        "Apple verwendet die von Kund:innen-Verhalten gesammelten Daten und wie sie ihre Geräte verwenden, um stetige Produktverbesserungen anzustreben und die Forschung und Entwicklung zukünftiger Produkte und Dienste zu informieren. Dies geschieht auch, wenn Konten speziell für Kinder eingerichtet werden. ",
                    en:
                        "Apple uses the data it gathers about the behaviour of its customers - how they use their devices - to inform product improvement and the research and development of future products and services. This happens also if accounts are set up specifically for children. ",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:GPSCoordinate",
                explanation: {
                    de:
                        "Apple verwendet die Standortdaten des Geräts, um u.a. die Dienste wie Echtzeit-Verkehr, Karten und Find my Phone bereitzustellen. Wenn ein:e Benutzer:in die Standortdienste einschaltet, können verschiedene Sensoren den Aufenthaltsort eines Geräts bis auf wenige Meter genau bestimmen.In der Vergangenheit führte das iPhone 11 z.B. regelmäßige Standortprüfungen durch, um festzustellen, ob es sich in einem Land befand, in dem die Verwendung einer neuen Ultra-Wide-Band-Datenübertragungstechnologie genehmigt war. Benutzer:innen können diese Funktion und Suche nicht ausstellen, die nur dann automatisch deaktiviert wird, wenn sich das Gerät an einem Ort befindet, wo diese Technologie noch nicht verfügbar ist.",
                    en:
                        "Apple uses device location data to provide its services like realtime traffic, maps and Find my Phone, among others. If a user turns on location services, various sensors can pinpoint the whereabouts of a device to within a few metres. In the past, the iPhone 11 made regular location checks to determine if it was in a country where the use of a new Ultra Wide Band data transfer technology was approved, something that couldn't be turned off by the user - unless by travelling to a location where it would become automatically disabled.",
                },
            },
            // TODO: We don't have a category to highlight for behavioral
            /*
            [parentCategories.behavioral]: {
            },
            */
            [parentCategories.financial]: {
                category: "dpv:Financial",
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
                de:
                    "Apple ist ein Technologieunternehmen, hat aber ein eigenes Spezialgebiet: Endgeräte für Verbraucher:innen. Andere Aspekte des Geschäfts erfordern andere Fachkenntnisse und die IT-Infrastruktur und Back-End-Systeme werden von strategischen Geschäftspartner:innen aus der IT-Branche bereitgestellt.",
                en:
                    "Apple is a technology company but has its area of speciality - consumer end devices. Other aspects of business require different expertise and IT infrastructure and back-end systems are provided by their IT strategic business partners.",
            },
        },
    },
    "BMW AG (DE)": {
        dataTypeCorrelation: {
            types: ["dpv:IPAddress", "dpv:GPSCoordinate", "dpv:Interest"],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären. BMW möchte keine Gelegenheit verpassen, Menschen zum Kauf eines ihrer Fahrzeuge zu bewegen, und durch die gemeinsame Nutzung mehrerer Datentypen kann BMW die Überzeugungskraft der Verkaufsbemühungen maximieren. Auf diese Weise wurden die Techniken von Gebrauchtwagenverkaufenden, die dies früher in persona taten, automatisiert und in ein scheinbar privateres Browsing-Erlebnis eingebettet.",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. BMW wouldn't want to miss an opportunity to try and encourage someone to purchase one of their vehicles and by sharing multiple datatypes they can maximise the persuasiveness of their sales efforts. In this way, the techniques of a used car salesman who previously at least did this to your face, have been automated and embedded in what seems like a more private browsing experience.",
            },
        },
        dataTypeCategories: {
            // TODO: dpv:Age doesn't seem to be in there
            /*
            [parentCategories.individual]: {
                category: "dpv:Age",
            },
            */
            [parentCategories.social]: {
                category: "dpv:Language",
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
                explanation: {
                    de:
                        "BMW verwendet auf der Website Cookies, die das Verhalten der Nutzer:innen beim Surfen verfolgen und die kombiniert werden, um Nutzende bei späteren Besuchen wiederzuerkennen und das Verhalten im Zeitverlauf abzubilden. Die Daten, die aus diesem Prozess gewonnen werden, können Dinge sein, wie das bestimmte Automodell, das eine Person am häufigsten angesehen hat, oder die Fahrzeugklasse, mit der sie die meiste Zeit verbringt. BMW teilt solche Daten mit Unternehmen wie Sophus 3 – einem Unternehmen, das sich auf das Kaufverhalten von Autos spezialisiert hat und mit vielen großen Herstellenden zusammenarbeitet.",
                    en:
                        "BMW uses cookies on its website that track the behaviour of users as they browse and that are combined to recognise users on subsequent visits and map behaviour over time. The data garnered from this process can be things like the particular model of car that a person has viewed most, or the class of vehicles they spend most time engaging with. BMW shares data such as this with companies like Sophus 3 - a company that specialises in car buying behaviour and works with many major manufacturers.",
                },
            },
            // TODO: dpv:Tracking seems to be there, but not under behavioral data
            /*
            [parentCategories.behavioral]: {
                category: "dpv:Tracking",
            },
            */
            [parentCategories.financial]: {
                category: "dpv:Financial",
            },
        },
        dataRecipient: {
            name: "BOSCH Service Solutions GmbH (DE)",
            companyExplanation: {
                de:
                    "Bosch Service Solutions ist ein führender Anbieter für Business Process Outsourcing. Bosch Service Solutions  unterstützt bei der Prozessoptimierung mit fünf Kernbereichen: Customer Experience Services, Mobility Services, Monitoring Services und Business Services. Der Firmensitz ist Stuttgart (DE).",
                en:
                    "Bosch Service Solutions is a leading provider of Business Process Outsourcing. Bosch Service Solutions supports process optimisation with four core areas: Customer Experience Services, Mobility Services, Monitoring Services and Business Services. The company is headquartered in Stuttgart (DE).",
            },
            industryExplanation: {
                de:
                    "Damit ein Unternehmen wie BMW effizient arbeiten kann, müssen die richtigen Lieferant:innen und Dienstleistungsunternehmen ausgewählt werden; diese Unternehmen benötigen Daten, um ihre Produkte zielgerichtet für BMW und z.B. die Fahrzeugaustattung zu gestalten.",
                en:
                    "Part of making a business like BMW work efficiently means choosing the right suppliers and services companies and these companies require data to render those services.",
            },
        },
    },
    "Google LLC (US)": {
        dataTypeCorrelation: {
            types: [
                "dpv:GeneralReputation",
                "dpv:TelephoneNumber",
                "dpv:GPSCoordinate",
            ],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären. Als Unternehmen, das u.a. Geld durch die Zusammenarbeit mit Werbetreibenden verdient, ist Google an allen Informationen interessiert, die Aufschluss über die Effektivität der eigens verkauften Dienstes geben können. Die Bestimmung des Standorts einer Person zu einem bestimmten physischen Geschäft kann auf das Interesse an bestimmten Produkten hindeuten, die aus anderen Quellen bestätigt und verwendet werden können. Diese konkreten Daten können dann an Werbetreibenden weiter verkauft werden, die versuchen, das Verbraucher:innen-Verhalten auf einer immer granulareren Ebene zu beeinflussen.",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. As an advertising company, Google is interested in any information that can inform the effectiveness of the service they are selling. Determining a person's location to a particular physical store can indicate interest in certain products that can be corroborated from other sources and used to sell access to advertisers who are attempting to influence consumer behaviour on an ever more granular level. ",
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
                        "Google macht aus verschiedenen Gründen Gebrauch von GPS-Koordinaten – nicht zuletzt, um die genauere Ausrichtung von Werbung auf Menschen innerhalb eines bestimmten geografischen Gebiets zu ermöglichen. Es ist nicht mehr überraschend, wenn Menschen Werbung für Produkte sehen, die nur in der eigenen geografischen Nähe verfügbar sind – und so nützlich es auch ist, über lokale Produkte und nahegelegene Dienstleistungen zu erfahren, können punktgenaue Werbekampagnen Wahlen beeinflussen. Google verlangt bspw., dass jede politische Werbung, die in der EU gezeigt wird, einen klaren Hinweis darauf enthält, wer dafür bezahlt hat. Ein weiteres Beispiel sind die Verkehrsstatistiken auf Google Maps, die ebenfalls auf der massenhaften Erfassung von Gerätestandortdaten und der Weitergabe an andere Nutzer:innen beruhen. Ein Bericht von Quartz aus dem Jahr 2017, der zeigte, dass Standortdaten, die aus der Nähe zu zahlreichen Mobilfunkmasten abgeleitet wurden, standardmäßig an Google übertragen wurden, selbst wenn die Standortdienste ausgeschaltet waren oder keine SIM-Karte eingelegt war. Dies führte dann zu einer Änderung der Datenpraktiken des Unternehmens.",
                    en:
                        "Google makes use of GPS coordinates for various reasons – not least to enable the more precise targeting of advertising to people within a certain geographical area. It is no longer surprising when we see advertisements for products that are only available in our geographic proximity - and as useful as it is to hear about products and services available nearby, pinpoint ad campaigns can sway elections. Google does require that any political advertising shown in the EU comes with clear notice about who paid for it. Another example is the traffic stats on Google maps thats also rely on the mass gathering of device location data and sharing with other users. A report by Quartz from 2017 showing that location data derived from proximity to numerous cell towers was being transmitted to Google by default even when location services were turned off or no SIM was inserted, led to a change in their data practices.",
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
            name: "WayToGrow (PL)",
            companyExplanation: {
                de:
                    "Waytogrow ist eine unabhängige Expert:innen-Gruppe, die sich auf programmatische und datengesteuerte Werbung spezialisiert haben.",
                en:
                    "Waytogrow is an independent group of experts specialising in programmatic and data-driven advertising.",
            },
            industryExplanation: {
                de:
                    "Google rühmt sich, Partnerschaften mit über 2 Millionen Websites einzugehen, um Anzeigen auszuliefern. Ihre ausgefeilten Analysen, ihre tiefe Marktdurchdringung und ihr riesiges Partner:innen-Netzwerk in fast 100 Ländern machen die hochgranularen Ad-Targeting-Services möglich, die sie anbieten.",
                en:
                    "Google boasts partnering with over 2 million websites to display ads. Their sophisticated analytics, deep market penetration and vast partner network across nearly 100 countries, make the highly granular ad targeting services they offer possible.",
            },
        },
    },
    "Amazon Europe Core SARL (LU)": {
        dataTypeCorrelation: {
            types: ["dpv:CreditRecord", "dpv:Language", "dpv:BrowsingBehavior"],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären. Im Fall von Amazon kann die ausgefeilte Messung des Nutzer:innen-Verhaltens und der Gewohnheiten verwendet werden, um wahrscheinliche Kund:innen für die neuesten Produkte des Unternehmens zu erkennen und sie automatisch mit Werbekampagnen im gesamten Web anzusprechen.",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. In the case of Amazon, their sophisticated measurement of user behaviour and habits can be used to spot likely customers for its newest products and automatically target them across the web with advertising campaigns.",
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
            },
        },
    },
    "Facebook (US)": {
        dataTypeCorrelation: {
            types: ["dpv:TelephoneNumber", "dpv:LifeHistory", "dpv:Biometric"],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären. Nur durch die gemeinsame Nutzung von Daten mit potenziellen Werbetreibenden kann Facebook die Nutzenden bis hin zu sehr feinen Spezifikationen ansprechen. Werbung ist nicht mehr etwas, das offen für alle sichtbar ist, sondern eine individuell zugeschnittene Nachricht, die darauf abzielt, die Personen zu beeinflussen, die für ihren Einfluss als empfänglich erachtet werden.",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. Only by sharing data with prospective advertisers can Facebook target their users down to very finely detailed specifications. Advertising is no longer something that is openly visible for all to see, but individually bespoke messaging designed to influence the individuals deemed susceptible to its influence.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
            },
            [parentCategories.social]: {
                category: "dpv:PoliticalAffiliation",
                explanation: {
                    de:
                        'Für viele der Nutzenden hat Facebook Zugriff auf die Arten von personenbezogenen Daten, die unter der GDPR als „besondere Kategorie personenbezogener Daten" der sensibelsten Art eingestuft werden. Dazu gehören Informationen über die politische Zugehörigkeit, die Religion oder die ethnische Herkunft einer Person. Facebook-Dating erklärt ausdrücklich, dass religiöse Ansichten oder das Interesse an der Partner:innen-Suche mit bestimmten Geschlechtern keinen Einfluss auf die angezeigte Werbung der Nutzenden haben, politische Ansichten sind davon jedoch ausgenommen und werden auch mit dieser Funktion weiter für individualisierte Werbeanzeigen genutzt.',
                    en:
                        "For many of its users, Facebook has access to the kinds of personal data that are classified under the GDPR as \"Special Category Personal Data\" of the most sensitive kind. This includes information about individual's political affiliations, religion, or that pertaining to ethnic origin. Facebook Dating expressly states that religious views or interest in dating particular gender(s) will not influence a user's experience of advertising, but don't make an exception for political views.",
                },
            },
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
            },
            [parentCategories.behavioral]: {
                category: "dpv:PoliticalAffiliation",
                explanation: {
                    de:
                        'Für viele der Nutzenden hat Facebook Zugriff auf die Arten von personenbezogenen Daten, die unter der GDPR als „besondere Kategorie personenbezogener Daten" der sensibelsten Art eingestuft werden. Dazu gehören Informationen über die politische Zugehörigkeit, die Religion oder die ethnische Herkunft einer Person. Facebook-Dating erklärt ausdrücklich, dass religiöse Ansichten oder das Interesse an der Partner:innen-Suche mit bestimmten Geschlechtern keinen Einfluss auf die angezeigte Werbung der Nutzenden haben, politische Ansichten sind davon jedoch ausgenommen und werden auch mit dieser Funktion weiter für individualisierte Werbeanzeigen genutzt.',
                    en:
                        "For many of its users, Facebook has access to the kinds of personal data that are classified under the GDPR as \"Special Category Personal Data\" of the most sensitive kind. This includes information about individual's political affiliations, religion, or that pertaining to ethnic origin. Facebook Dating expressly states that religious views or interest in dating particular gender(s) will not influence a user's experience of advertising, but don't make an exception for political views.",
                },
            },
            // TODO: dpv:Financial doesn't seem to be in there
            /*
            [parentCategories.financial]: {
                category: "dpv:Financial",
            },
            */
        },
        dataRecipient: {
            name: "University College London (GB)",
            companyExplanation: {
                de:
                    "Das University College London (UK) gehört zur Universität London und ist als Mitglied der Russell-Gruppe (Verbund 24 führender, britischer Forschungsuniversitäten) eine der angesehensten Eliteuniversitäten der Welt.",
                en:
                    "University College London (UK) is part of the University of London and, as a member of the Russell Group (an association of 24 leading British research universities), is one of the most prestigious elite universities in the world.",
            },
            industryExplanation: {
                de:
                    "Der berüchtigte Datenskandal von Cambridge Analytica wurde durch eine Quiz-App ermöglicht, die angeblich Informationen von Facebook-Nutzenden zu Forschungszwecken sammelte und dann für die Durchführung fragwürdiger Wahlkampagnen verkaufte. Die Auswirkungen dieses Skandals trugen maßgeblich zur Einführung der derzeitigen europäischen GDPR-Richtlinien bei.",
                en:
                    "The infamous Cambridge Analytica data scandal was made possible using a personality quiz app that was supposedly gathering information from Facebook users for research purposes. The fallout from this has contributed significantly to the introduction of the GDPR framework we now enjoy.",
            },
        },
    },
    "PayPal Europe SARL Et Cie SCE (LU)": {
        dataTypeCorrelation: {
            types: [
                "dpv:EmailAddress",
                "dpv:TelephoneNumber",
                "dpv:CreditCardNumber",
            ],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären. Das Hacken von Menschen wird mit der Zeit immer alltäglicher und mit genügend Daten über eine Person ist es nicht allzu kompliziert, sich als diese auszugeben und ihr Geld zu stehlen. Rechtliche Konsequenzen für internationale Verbrechen, die aus der Ferne unter Verwendung von Daten aus verschiedenen Quellen durchgeführt werden, sind ebenfalls schwieriger zu untersuchen und bleiben oft ungestraft.",
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
            name: "Google Inc. (US)",
            companyExplanation: {
                de:
                    "Google LLC zusammen mit dem Mutterkonzern Alphabet Inc. gehört als Technologie-Konzern zu einer der sog. Big-Five-Unternehmen, also den größten Tech-Konzernen der Welt und hat ihren Hauptsitz in Kalifornien (USA).",
                en:
                    "Google LLC and its parent holding company Alphabet Inc., are based in California (USA) As a technology group they belong to one of the so-called Big Five companies, i.e. the largest tech groups in the world..",
            },
            industryExplanation: {
                de:
                    "Marketing ist für jedes Unternehmen wichtig und legitim, aber die Größenskala, die das Internet ermöglicht, und die daraus resultierenden Netzwerkeffekte, die in diesem Jahrhundert entstanden sind, gehen weit über klassisch-traditionelle Marketingziele hinaus.",
                en:
                    "Marketing is important and legitimate for any company, but the difference of scale made possible by the internet and the network effects that have emerged this century turn traditional intuitive understanding on its head.",
            },
        },
    },
    "TikTok Technology Limited (IE)": {
        dataTypeCorrelation: {
            types: ["dpv:Age", "dpv:Interest", "dpv:Picture"],
            explanation: {
                de:
                    "Wenn mehrere Datentypen gemeinsam genutzt werden, können Rückschlüsse auf die betroffenen Personen gezogen werden, die sonst aus den einzelnen Datenpunkten allein nicht möglich wären. TikTok merkt sich alle viralen Videos, die die Nutzer:innen am häufigsten ansehen, und nutzt ein immer tiefer gehendes Wissen über individuelle Präferenzen, die Unterhaltungsauswahl und Trends, um die Firmen, denen TikTok Werbeplatzierungen, verkauft, über das Verhalten der App-Nutzenden, zu informieren.",
                en:
                    "When multiple datatypes are shared together, conclusions about data subjects can be reached that would otherwise be impossible to determine from any of those single data points shared alone. TikTok notes all the viral videos users view the most and harnesses an ever deepening knowledge about tastes, entertainment choices and trends to inform the advertising placements it sells to its customers.",
            },
        },
        dataTypeCategories: {
            [parentCategories.individual]: {
                category: "dpv:Age",
                explanation: {
                    de:
                        "TikTok misst, welche Videos von jedem:r Nutzer:in angesehen werden, und nutzt diese Daten, um einen Blackbox-Algorithmus für Inhaltsvorschläge zu entwickeln. Die schiere Größe dieser Aufgabe ist nur mit einem solchen Algorithmus möglich, und eine der Hauptmetriken, nach der dies bestimmt wird, ist das Interesse. Durch die Interaktion mit bestimmten Videokategorien werden die Nutzer:innen gruppiert und können dann von Werbetreibenden auf Basis dieser Daten gezielt angesprochen werden.",
                    en:
                        "TikTok measures which videos are viewed by each of its users and uses this data to inform a black-box content suggestion algorithm. The sheer scale of this task is only possible using such an algorithm, and one of the chief metrics by which this is determined is interest. By interacting with certain categories of videos, users are grouped and can then be targeted by advertisers based on this data.",
                },
            },
            [parentCategories.social]: {
                category: "dpv:Interest",
                explanation: {
                    de:
                        "TikTok misst, welche Videos von jedem:r Nutzer:in angesehen werden, und nutzt diese Daten, um einen Blackbox-Algorithmus für Inhaltsvorschläge zu entwickeln. Die schiere Größe dieser Aufgabe ist nur mit einem solchen Algorithmus möglich, und eine der Hauptmetriken, nach der dies bestimmt wird, ist das Interesse. Durch die Interaktion mit bestimmten Videokategorien werden die Nutzer:innen gruppiert und können dann von Werbetreibenden auf Basis dieser Daten gezielt angesprochen werden.",
                    en:
                        "TikTok measures which videos are viewed by each of its users and uses this data to inform a black-box content suggestion algorithm. The sheer scale of this task is only possible using such an algorithm, and one of the chief metrics by which this is determined is interest. By interacting with certain categories of videos, users are grouped and can then be targeted by advertisers based on this data.",
                },
            },
            // TODO: Not in there
            /*
            [parentCategories.technical]: {
                category: "dpv:BrowserFingerprint",
            },
            */
            [parentCategories.behavioral]: {
                category: "dpv:BrowsingBehavior",
            },
            [parentCategories.financial]: {
                category: "dpv:Transactional",
            },
        },
        dataRecipient: {
            name: "ByteDance Ltd. (KY)",
            companyExplanation: {
                de:
                    "ByteDance ist der TikTok-Mutterkonzern – mit dem Hauptquartier in Peking (China). Wie viele chinesische Unternehmen, gehört auch das interne ByteDance-Firmenkomitee der kommunistischen Partei Chinas an, was u.a. zu inhaltlichen Zensuren auf TikTok führt.",
                en:
                    "ByteDance is the company behind TikTok. Like many Chinese companies - ByteDance's internal corporate committee belongs to the Chinese Communist Party, which leads to content censorship on TikTok, among other things.",
            },
            industryExplanation: {
                de:
                    "Wie viele Firmen, ist auch TikTok ein zusammenhängendes Netzwerk von Unternehmen, die u.a. aus steuerrechtlichen Gründen über verschiedene Länder verteilt sind. Der Datenaustausch zwischen diesen verbundenen Unternehmen ist gängige Praxis und findet regelmäßig statt.",
                en:
                    "Like many companies, TikTok is an interconnected web of companies spread across different countries. Data sharing between these related companies is standard practice and takes place routinely.",
            },
        },
    },
    Signal: {
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
            name: "Signal Messenger LLC (US)",
            companyExplanation: {
                de:
                    "Die elopage GmbH mit Sitz in Berlin (DE) bietet Onlinelösungen für eigene Bezahlseiten, die Erstellung der Produkte und Upsells in einem Tool.",
                en:
                    "elopage GmbH, based in Berlin (DE), offers online solutions for own payment pages, the creation of products and upsells in one tool.",
            },
            industryExplanation: {
                de:
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    Threema: {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    iMessage: {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    Instagram: {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    WhatsApp: {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    "Facebook Messenger": {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    Snapchat: {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
    TikTok: {
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
                    "Persönliche Daten werden weitergegeben, um Zahlungen barrierearm zu ermöglichen und um die gesetzlichen Verpflichtungen zu erfüllen, die polypoly als europaweite Datengenossenschaft hat.",
                en:
                    "Data is shared in order to make payment possible, and to fulfil the legal obligations that polypoly has as a Europe wide data cooperative.",
            },
        },
    },
};
