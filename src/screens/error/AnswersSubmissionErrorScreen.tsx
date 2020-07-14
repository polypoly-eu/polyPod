import { useState } from "react";
import SubmitSurveyButton from "../../components/buttons/SubmitSurveyButton";
import {useTranslation} from "react-i18next";
import Loader from "../../components/basic/Loader";
import PolyButton from "../../components/buttons/PolyButton";
import React from "react";
import { useHistory } from "react-router-dom";

export default function AnswersSubmissionErrorScreen() {
    const [showLoader, setShowLoader] = useState(false);
    const {t} = useTranslation();
    const history = useHistory();

    return (
        <div>
            <Loader loading={showLoader} />
            {t('survey.error.title')}
            {t('survey.error.message')}
            <SubmitSurveyButton
                title={t('survey.button.try_again')}
                onStart={() => setShowLoader(true)}
                onFinished={() => setShowLoader(false)}
            />
            <PolyButton
                title={t('survey.button.home')}
                onPress={() => {
                    history.push("/home")
                }}
            />
        </div>
    );
}