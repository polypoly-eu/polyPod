const Prismic = require("@prismicio/client");
const fs = require("fs");

const apiEndpoint = "https://polypoly-coop.cdn.prismic.io/api/v2";
const apiToken =
    "MC5ZSkVmQ2hBQUFDRUFXQVpZ.77-977-977-9X--_ve-_vTzvv73vv70K77-9BgpieU3vv73vv70N77-9UO-_vQvvv73vv73vv73vv70P77-977-9K--_vQ";

const client = Prismic.client(apiEndpoint, { accessToken: apiToken });
const lexicon = {};

client
    .query(Prismic.Predicates.at("document.type", "lexicon_page"), {
        lang: "*",
    })
    .then(function (response) {
        for (let translationData of response.results) {
            const groups = translationData.data.body;
            const languageCode = translationData.lang.substring(0, 2);
            lexicon[languageCode] = loadLanguage(groups);
        }
        writeLexiconFile();
    });

function loadTermExplanation(term) {
    let explanation = "";
    for (let textPart of term) {
        if (textPart.type == "paragraph")
            explanation += `<p>${textPart.text}</p>`;
        else explanation += textPart.text;
    }
    return explanation;
}

function loadSortingGroup(terms) {
    const group = {};
    for (let term of terms) {
        group[term.question[0].text] = loadTermExplanation(term.answer);
    }
    return group;
}

function loadLanguage(groups) {
    const language = {};
    for (let i = 1; i < groups.length; i++) {
        language[groups[i].items[0].question[0].text[0]] = loadSortingGroup(
            groups[i].items
        );
    }
    return language;
}

function writeLexiconFile() {
    fs.writeFile(
        "src/data/lexicon.json",
        JSON.stringify(lexicon),
        "utf8",
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
}
