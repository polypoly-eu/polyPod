import { useContext } from "react";
import {QuestionnaireListContext} from "../../context/questionnaire-list-context";
import {QuestionnaireContext} from "../../context/questionnaire-context";
import PolyButton from "./PolyButton";
import React from "react";
import submitAnswers from "../../server/answer-submission";
import { useHistory } from "react-router-dom";

export default function SubmitSurveyButton({
                                               title,
                                               onStart = () => {},
                                               onFinished = () => {},
                                           }) {
    const {markQuestionaireSubmitted} = useContext(QuestionnaireListContext);
    const {getQuestionnaire} = useContext(QuestionnaireContext);
    const history = useHistory();

    return (
        <PolyButton
            title={title}
            onPress={() => {
                onStart();
                submitAnswers(getQuestionnaire())
                    .then(() => {
                        markQuestionaireSubmitted(getQuestionnaire());
                        onFinished();
                        //navigation.navigate(SubmittedScreenRoute);
                    })
                    .catch(ex => {
                        try {
                            console.error(ex);
                        } catch (_) {}
                        // Make sure this is called, as otherwise the Loading screen will not dissapear.
                        onFinished();
                        // TODO error screen
                        //navigation.navigate(AnswersSubmissionErrorScreenPath);
                    });
            }}
        />
    );
}