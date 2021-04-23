import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import PolyButton from "../../components/buttons/PolyButton";
import { useHistory } from "react-router-dom";

const AuthorDetailsScreen = function () {
    const { t } = useTranslation();
    const { getQuestionnaire } = useContext(QuestionnaireContext);
    const questionnaire = getQuestionnaire();

    const history = useHistory();
    /* TODO "Back" übersetzen */
    return (
        <div>
            {t(questionnaire.author.name)}
            {t(questionnaire.author.description)}
            <PolyButton
                title={t("Back")}
                onPress={() => {
                    history.goBack();
                }}
            />
        </div>
    );
};

export const title = "intro.author";
export const route = "AuthorDetails";
export default AuthorDetailsScreen;
