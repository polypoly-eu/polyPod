import React from "react";

export default function AnswerPreviewCard({
    question = "What is your lucky number?",
    AnswerComponent = () => <div />,
}) {
    return (
        <div>
            {question}
            <AnswerComponent />
        </div>
    );
}
