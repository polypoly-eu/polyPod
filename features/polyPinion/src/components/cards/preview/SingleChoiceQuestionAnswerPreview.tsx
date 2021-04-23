import React from "react";

import AnswerPreviewCard from "./AnswerPreviewCard";
import AnswerChoiceGroupPreview from "./AnswerChoiceGroupPreview";
import PpSingleChoiceQuestion from "../../../questionnaire/PpSingleChoiceQuestion";

export default function SingleChoiceQuestionAnswerPreview({
    question = new PpSingleChoiceQuestion(),
}) {
    return (
        <AnswerPreviewCard
            question={question.description()}
            AnswerComponent={() => (
                <AnswerChoiceGroupPreview
                    choices={question.isAnswered() ? [question.value()] : []}
                />
            )}
        />
    );
}
