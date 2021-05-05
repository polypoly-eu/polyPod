const Prismic = require("@prismicio/client");
const fs = require("fs");

const apiEndpoint = "https://polypoly-coop.cdn.prismic.io/api/v2";
const apiToken = null; //enter valid token here

if (apiToken) {
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
} else {
    console.log(
        "Warning: This script can only be run by polypoly staff! You can use the lexicon with the most recent data that's already there."
    );
}
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
