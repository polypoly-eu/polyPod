import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import PolyButton from "./PolyButton";
import { useHistory } from "react-router-dom";

export default function ReviewSurveyButton({
    title = 'generic.button.review',
    questionnaire,
  }) {
    const history = useHistory();
    const {setQuestionnaire} = useContext(QuestionnaireContext);

    return (
      <PolyButton
        title={title}
        onPress={() => {
          if (questionnaire) {
            setQuestionnaire(questionnaire);
          }
          history.push("/answers");
        }}
      />
    );
  }