import React from 'react';

import AnswerPreviewCard from './AnswerPreviewCard';
import AnswerChoiceGroupPreview from './AnswerChoiceGroupPreview';
import PpTextQuestion from '../../../questionnaire/PpTextQuestion';

export default function TextQuestionAnswerPreview({
                                                      question = new PpTextQuestion(),
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