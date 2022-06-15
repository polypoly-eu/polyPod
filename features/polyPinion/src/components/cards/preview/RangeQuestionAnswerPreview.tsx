import React from "react";

import AnswerPreviewCard from "./AnswerPreviewCard";
import PolyRangeButton from "../../../components/basic/PolyRangeButton";
import PpTextQuestion from "../../../questionnaire/PpTextQuestion";

export default function RangeQuestionAnswerPreview({ question = new PpTextQuestion() }) {
    return (
        <AnswerPreviewCard
            question={question.description()}
            AnswerComponent={() =>
                question.isAnswered() && (
                    <PolyRangeButton label={question.value()} checked={true} disabled={true} />
                )
            }
        />
    );
}
