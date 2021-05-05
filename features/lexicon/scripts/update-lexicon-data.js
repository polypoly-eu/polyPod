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
            const terms = translationData.data.body;
            const languageCode = translationData.lang.substring(0, 2);
            lexicon[languageCode] = {};
            for (let i = 1; i < terms.length; i++) {
                const group = {};
                for (let term of terms[i].items) {
                    let explanation = "";
                    for (let textPart of term.answer) {
                        if (textPart.type == "paragraph")
                            explanation += `<p>${textPart.text}</p>`;
                        else explanation += textPart.text;
                    }
                    group[term.question[0].text] = explanation;
                }
                lexicon[languageCode][
                    terms[i].items[0].question[0].text[0]
                ] = group;
            }
        }
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
    });
