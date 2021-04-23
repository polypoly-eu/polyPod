import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import ReviewSurveyButton from "../../components/buttons/ReviewSurveyButton";
import FinalizeSurveyButton from "../../components/buttons/FinalizeSurveyButton";

const SurveyCompletedScreen = function () {
    const { t } = useTranslation();
    const { getQuestionnaire } = useContext(QuestionnaireContext);

    /* <Image
            style={[styles.image, {maxHeight: height}]}
            resizeMode={'contain'}
            source={backgroundImage}
          />*/
    return (
        <div>
            {t("survey.screen_completed.thank_you")}
            <FinalizeSurveyButton title={t("survey.button.finalize")} />
            <ReviewSurveyButton
                title={t("survey.button.review")}
                questionnaire={getQuestionnaire()}
            />
        </div>
    );
};

export default SurveyCompletedScreen;
