import React from "react";
import FooterNavigation from "../basic/FooterNavigation";

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
            <FooterNavigation />
        </div>
    );

}