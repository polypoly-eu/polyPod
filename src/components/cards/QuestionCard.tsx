import React from "react";

export default function QuestionCard({
    index,
    question,
    instruction = "",
    AnswerComponent = () => <div />,
    AcceptComponent = () => <div />,
}) {
    return (
        <main className="question-card">
            <strong className="question-card-index">{index + 1}</strong>
            <h1 className="question-card-question">{question}</h1>
            {instruction.length > 0 && <p className="question-card-instruction">{instruction}</p>}
            <AnswerComponent />
            <AcceptComponent />
        </main>
    );
}
