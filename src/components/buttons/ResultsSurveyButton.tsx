import PolyButton from "./PolyButton";
import React from "react";

export default function ResultsSurveyButton({
    title = 'generic.button.results',
    questionnaire,
  }) {
    const openLink = function(link) {
        /*
      Linking.canOpenURL(link)
        .then(supported => {
          if (supported) {
            Linking.openURL(link);
          }
        })
        .catch(err => console.error('An error occurred', err));
        */
    };

    return (
      <PolyButton
        title={title}
        onPress={() => {
          openLink(questionnaire.result.url);
        }}
      />
    );
  }