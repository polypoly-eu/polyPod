import * as React from "react";
import MainSurveyCard from "./MainSurveyCard";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import { Tabs, Tab } from "../../components/common/tabs";

export default function ActiveSurveys() {
    const { questionnaireList } = React.useContext(QuestionnaireListContext);

    const activeQuestionnaire = questionnaireList; //.filter(questionnaire =>
    //questionnaire.isActive(),
    //);

    // TODO: Adjust the link targets
    // took the hrefs out for now as they were creating a new container inside the other one
    return (
        <>
            <Tabs>
                <Tab active={true}>
                    <a>Featured</a>
                </Tab>
                <Tab>
                    <a>Übermittelt</a>
                </Tab>
                <Tab>
                    <a>Abgelaufen</a>
                </Tab>
            </Tabs>
            {activeQuestionnaire.map((questionnaire) => (
                <MainSurveyCard key={questionnaire.id} questionnaire={questionnaire} />
            ))}
        </>
    );
}
