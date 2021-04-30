import { useTranslation } from "react-i18next";
import React from "react";
import PolyButton from "../../components/buttons/PolyButton";
import { useHistory } from "react-router-dom";

// TODO Settings useEffect warum auch immer

export default function OnboardingScreenThree() {
    const { t } = useTranslation();
    const history = useHistory();
    return (
        <div>
            {t("onboarding.screen_03.main_message_02")}
            <PolyButton
                title={"onboarding.screen_03.button.continue"}
                onPress={() => {
                    history.push("/onboarding4");
                }}
            />
        </div>
    );
}
