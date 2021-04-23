import * as React from "react";
import MainSurveyCard from "./MainSurveyCard";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import { Tabs, Tab } from "@polypoly-eu/poly-look/lib/tabs";

export default function ActiveSurveys() {
    const { questionnaireList } = React.useContext(QuestionnaireListContext);

    const activeQuestionnaire = questionnaireList; //.filter(questionnaire =>
    //questionnaire.isActive(),
    //);

    // TODO: Adjust the link targets
    return (
        <>
            <Tabs>
                <Tab active={true}>
                    <a href="/">Featured</a>
                </Tab>
                <Tab>
                    <a href="/">Übermittelt</a>
                </Tab>
                <Tab>
                    <a href="/">Abgelaufen</a>
                </Tab>
            </Tabs>
            {activeQuestionnaire.map((questionnaire) => (
                <MainSurveyCard key={questionnaire.id} questionnaire={questionnaire} />
            ))}
        </>
    );
}
