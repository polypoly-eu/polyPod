import { useTranslation } from "react-i18next";
import React from "react";
import PolyButton from "../../components/buttons/PolyButton";
import { useHistory } from "react-router-dom";

export default function OnboardingScreenTwo() {
    const {t} = useTranslation();
    const history = useHistory();
    return (
          <div>

              {t('onboarding.screen_02.main_message')}
            <PolyButton
              title={'onboarding.screen_02.button.continue'}
              onPress={() => {
                history.push("/onboarding3");
              }}
            />
          </div>
    );
  };
