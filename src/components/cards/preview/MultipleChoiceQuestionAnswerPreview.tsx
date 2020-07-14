import React from 'react';

import AnswerPreviewCard from './AnswerPreviewCard';
import AnswerChoiceGroupPreview from './AnswerChoiceGroupPreview';
import PpMultipleChoiceQuestion from '../../../questionnaire/PpMultipleChoiceQuestion';

export default function MultipleChoiceQuestionAnswerPreview({
                                                   question = new PpMultipleChoiceQuestion(),
                                               }) {
    return (
        <AnswerPreviewCard
            question={question.description()}
            AnswerComponent={() => (
                <AnswerChoiceGroupPreview choices={question.value()} />
            )}
        />
    );
}