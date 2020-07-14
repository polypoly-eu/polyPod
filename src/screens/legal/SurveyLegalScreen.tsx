import {useState, useContext} from "react";
import { useTranslation, Trans } from "react-i18next";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import React from "react";
import Loader from "../../components/basic/Loader";
import PolyButton from "../../components/buttons/PolyButton";
import { useHistory } from "react-router-dom";
import SubmitSurveyButton from "../../components/buttons/SubmitSurveyButton";

export default function SurveyLegalScreen() {
    const [showLoader, setShowLoader] = useState(false);
    const {t} = useTranslation();
    const {getQuestionnaire} = useContext(QuestionnaireContext);
    const history = useHistory();
    return (
        <div>
            <Loader loading={showLoader} />
            <div>{t('survey.screen_legal.title')}</div>
            <div>
                <Trans i18nKey={getQuestionnaire().legal.content}>
                    <a href={t(getQuestionnaire().legal.link)}>
                        {getQuestionnaire().legal.link}
                    </a>
                </Trans>
            </div>
            <div>
                <PolyButton
                    title={t('survey.button.disagree')}
                    onPress={() => {
                        history.goBack();
                    }}
                />
                <SubmitSurveyButton
                    title={t('survey.button.agree')}
                    onStart={() => setShowLoader(true)}
                    onFinished={() => setShowLoader(false)}
                />
            </div>
        </div>
    );
}