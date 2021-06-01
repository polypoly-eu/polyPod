import { useTranslation } from "react-i18next";
import * as React from "react";
import MainSurveyCard from "./MainSurveyCard";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import { Tabs, Tab } from "../../components/common/tabs";
import PpQuestionnaire from "../../questionnaire/PpQuestionnaire";

import "./ActiveSurveys.css";

export default function ActiveSurveys() {
    const { t } = useTranslation();
    const { questionnaireList } = React.useContext(QuestionnaireListContext);
    const [openTab, setOpenTab] = React.useState("active");

    const filters = {
        active: (e: PpQuestionnaire) => e.isActive(),
        submitted: (e: PpQuestionnaire) => e.isSubmitted(),
        expired: (e: PpQuestionnaire) => e.isExpired(),
    };

    const handleTabChange = (newTab: string) => {
        setOpenTab(newTab);
    };

    const displayedQuestionnaires: Array<PpQuestionnaire> = questionnaireList.filter((e) =>
        filters[openTab](e)
    );

    return (
        <>
            <Tabs>
                <Tab active={openTab == "active" ? true : false}>
                    <p onClick={() => handleTabChange("active")}>{t("home.tabs.featured")}</p>
                </Tab>
                <Tab active={openTab == "submitted" ? true : false}>
                    <p onClick={() => handleTabChange("submitted")}>{t("home.tabs.submitted")}</p>
                </Tab>
                <Tab active={openTab == "expired" ? true : false}>
                    <p onClick={() => handleTabChange("expired")}>{t("home.tabs.expired")}</p>
                </Tab>
            </Tabs>
            <div className="surveys-list">
                {displayedQuestionnaires.map((questionnaire) => (
                    <MainSurveyCard key={questionnaire.id} questionnaire={questionnaire} />
                ))}
            </div>
        </>
    );
}
