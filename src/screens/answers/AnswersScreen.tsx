import FinalizeSurveyButton from "../../components/buttons/FinalizeSurveyButton";
import {useTranslation} from "react-i18next";
import PolyButton from "../../components/buttons/PolyButton";
import {QuestionnaireContext} from "../../context/questionnaire-context";
import {useContext} from "react";
import React from "react";
import QuestionnaireAnswersList from "../../components/cards/preview/QuestionnaireAnswersList";
import { useHistory } from "react-router-dom";

export default function AnswersScreen() {
    const {t} = useTranslation();
    const history = useHistory();
    const {getQuestionnaire, switchToFirstQuestion} = useContext(
        QuestionnaireContext,
    );

    return (
        <div>
            {getQuestionnaire().isActive()
                ? t('survey.screen_answers.description_before_submit')
                : getQuestionnaire().isSubmitted()
                    ? t('survey.screen_answers.description_after_submit')
                    : t('survey.screen_answers.description_not_submitted')}
            <QuestionnaireAnswersList
                ListFooterComponent={() =>
                    getQuestionnaire().isActive() ? (
                        <div>
                            <FinalizeSurveyButton
                                title={t('survey.button.finalize')}
                            />
                            <PolyButton
                                title={t('survey.button.edit')}
                                onPress={() => {
                                    switchToFirstQuestion();
                                    history.push("/survey");
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <PolyButton
                                title={t('survey.button.home')}
                                onPress={() => {
                                    history.push("/");
                                }}
                            />
                        </div>
                    )
                }
            />
        </div>
    );
}