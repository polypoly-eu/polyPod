import React from "react";

export default function QuestionCard({
                                         index,
                                         question,
                                         instruction = '',
                                         AnswerComponent = () => <div />,
                                         AcceptComponent = () => <div />,
                                     }) {
    return (
        <div>
            <div>{ index + 1 }</div>
            <div>{ question }</div>
            {instruction.length > 0 && (
                <div>{instruction}</div>
            )}
            <AnswerComponent />
            <AcceptComponent />
        </div>
    );

    // TODO footer navigation
}