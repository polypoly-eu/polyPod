import { useTranslation } from "react-i18next";
import React from "react";
import PolyButton from "../../components/buttons/PolyButton";
import { useHistory } from "react-router-dom";

export default function OnboardingScreenOne() {
    const { t } = useTranslation();
    const history = useHistory();
    return (
        <div>
            {t("onboarding.screen_01.title")}

            {t("onboarding.screen_01.main_message")}
            <PolyButton
                title={"onboarding.screen_01.button.continue"}
                onPress={() => {
                    history.push("/onboarding2");
                }}
            />
        </div>
    );
}
