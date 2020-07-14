import { useTranslation, Trans } from "react-i18next";
import React from "react";
import PolyButton from "../../components/buttons/PolyButton";
import { useHistory } from "react-router-dom";
import AsyncStorage from "../../util/async-storage";

// TODO Settings useEffect warum auch immer

export default function OnboardingScreenFour() {
    const {t} = useTranslation();
    const history = useHistory();

    const goToNextScreen = () => {
        AsyncStorage.setItem('onboardingshown', 'true').then(() => {
          history.push("/home");
        });
      };

    return (
          <div>
            <Trans i18nKey="onboarding.screen_04.message">
              leading <strong>polypoly</strong>
              with <strong>polyPod</strong>
              trailing
            </Trans>
            <PolyButton
              title={'onboarding.screen_04.button.continue'}
              onPress={() => {
                goToNextScreen();
              }}
            />
          </div>
    );
  };
