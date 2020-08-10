import { useContext } from "react";
import { QuestionnaireContext } from "../../context/questionnaire-context";
import React from "react";
import MultipleChoiceQuestion from "../../components/cards/MultipleChoiceQuestion";
import TextQuestion from "../../components/cards/TextQuestion";
import RangeQuestion from "../../components/cards/RangeQuestion";
import FooterNavigation from "../../components/basic/FooterNavigation";
import { Layout } from "@polypoly-eu/poly-look/lib/layout";

export default function QuestionScreen() {
    const { currentQuestion } = useContext(QuestionnaireContext);

    if (!currentQuestion) {
        return <div />;
    }

    const components = {
        TextQuestion: TextQuestion,
        MultipleChoiceQuestion: MultipleChoiceQuestion,
        RangeQuestion: RangeQuestion,
    };

    const Card = components[currentQuestion.screen() as any];

    return (
        <Layout header={<div />} footer={<FooterNavigation />}>
            <Card index={currentQuestion.index} question={currentQuestion} />
        </Layout>
    );
}
