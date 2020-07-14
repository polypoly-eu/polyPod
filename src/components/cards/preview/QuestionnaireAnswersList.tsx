import {QuestionnaireContext} from "../../../context/questionnaire-context";
import {useContext} from "react";
import React from "react";
import PpTextQuestion from "../../../questionnaire/PpTextQuestion";
import PpSingleChoiceQuestion from "../../../questionnaire/PpSingleChoiceQuestion";
import PpMultipleChoiceQuestion from "../../../questionnaire/PpMultipleChoiceQuestion";
import PpRangeQuestion from "../../../questionnaire/PpRangeQuestion";
import TextQuestionAnswerPreview from "./TextQuestionAnswerPreview";
import SingleChoiceQuestionAnswerPreview from "./SingleChoiceQuestionAnswerPreview";
import MultipleChoiceQuestionAnswerPreview from "./MultipleChoiceQuestionAnswerPreview";
import RangeQuestionAnswerPreview from "./RangeQuestionAnswerPreview";

export default function QuestionnaireAnswersList({ListFooterComponent}) {
    const {getQuestionnaire} = useContext(QuestionnaireContext);

    return <div>
        <ol>
            {
                getQuestionnaire().questions().map(item => {
                    let preview = <div />;
                    switch (item.constructor) {
                        case PpTextQuestion:
                            // TODO possible bug:
                            //   key 'test (de)' returned an object instead of string.
                            preview = (
                                <TextQuestionAnswerPreview question={item} />
                            );
                            break;
                        case PpSingleChoiceQuestion:
                            preview = (
                                <SingleChoiceQuestionAnswerPreview
                                    question={item}
                                />
                            );
                            break;
                        case PpMultipleChoiceQuestion:
                            preview = (
                                <MultipleChoiceQuestionAnswerPreview
                                    question={item}
                                />
                            );
                            break;
                        case PpRangeQuestion:
                            preview = (
                                <RangeQuestionAnswerPreview question={item} />
                            );
                            break;
                    }
                    return <li>{preview}</li>;
                })
            }
        </ol>
        <ListFooterComponent />
    </div>;
}