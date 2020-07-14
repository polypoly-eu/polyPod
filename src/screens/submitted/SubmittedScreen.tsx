import {useTranslation} from "react-i18next";
import PolyButton from "../../components/buttons/PolyButton";
import React from "react";
import { useHistory } from "react-router-dom";

export default function SubmittedScreen() {
    const {t} = useTranslation();
    const history = useHistory();

    return (
        <div>
            {t('survey.screen_submitted.answers_submited')}
            {t('survey.screen_submitted.thank_you')}
            <PolyButton
                title={t('survey.button.home')}
                onPress={() => history.push("/home")}
            />
        </div>
    );
}